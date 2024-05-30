import { updateNoteTags } from '@/actions/notetag';
import { oneDark } from '@/utils/codemirror-theme';
import { bulletPointPlugin, doReviseTagsInEditor, inlineNotePlugin, noteBlockPlugin, tagType, titleFormatPlugin } from '@/utils/codemirror-utils';
import { useIsMounted } from '@/utils/react-utils';
import { writeToStoreAndDb } from '@/utils/storage-utils';
import { useLocalStore, useStore } from '@/utils/store-utils';
import { useTagsContext } from '@/utils/tags-provider';
import {
  closeBrackets,
  closeBracketsKeymap,
  completionKeymap
} from '@codemirror/autocomplete';
import { defaultKeymap, history, historyKeymap } from '@codemirror/commands';
import { markdown } from '@codemirror/lang-markdown';
import {
  bracketMatching,
  defaultHighlightStyle,
  foldKeymap,
  indentOnInput,
  syntaxHighlighting
} from '@codemirror/language';
import { languages as codeLanguages } from '@codemirror/language-data';
import { lintKeymap } from '@codemirror/lint';
import {
  EditorView,
  crosshairCursor,
  dropCursor,
  keymap,
  rectangularSelection
} from '@codemirror/view';
import { Highlighter } from '@lezer/highlight';
import { useEffect, useRef } from 'react';
import { TagSummary } from '../../utils/tags-worker';
import { useNotifier } from '../notifier';
import { PopupHandle } from '../popup/constants';
import { initialState } from './constants';
import { autocompleteExtension, createNotePersisterExtension, editorHasTextUpdater, pasteListener, textSelectorPlugin } from './shared';



export const useInputs = () => {

  const { store, state: { notes, stateInitialized } } = useStore();
  const { local } = useLocalStore('activePanel', initialState);
  const notify = useNotifier();
  const tagsWorker = useTagsContext();

  const popupRef = useRef<PopupHandle>(null);
  const editorRef = useRef<HTMLDivElement>(null);
  const codeMirror = useRef<EditorView | null>(null);

  const isMounted = useIsMounted();
  const hasNote = !!store.$state.activeNoteId;

  useEffect(() => {

    // Do not instantiate the editor until certain conditions are met
    if (!isMounted) return;
    if (!hasNote) return;
    if (!tagsWorker) return;

    // Create the CodeMirror editor
    codeMirror.current = new EditorView({
      doc: store.$state.notes.findOrThrow(n => n.id === store.$state.activeNoteId).text,
      parent: editorRef.current!,
      extensions: [
        history(),
        dropCursor(),
        indentOnInput(),
        syntaxHighlighting(defaultHighlightStyle as Highlighter, { fallback: true }),
        markdown({ codeLanguages }),
        bracketMatching(),
        closeBrackets(),
        rectangularSelection(),
        crosshairCursor(),
        EditorView.lineWrapping,
        EditorView.contentAttributes.of({ spellcheck: 'on', autocapitalize: 'on' }),
        keymap.of([...closeBracketsKeymap, ...defaultKeymap, ...historyKeymap, ...foldKeymap, ...completionKeymap, ...lintKeymap]),
        autocompleteExtension(store),
        createNotePersisterExtension({ debounce: 500, store, local }),
        textSelectorPlugin(local),
        editorHasTextUpdater(local),
        pasteListener,
        bulletPointPlugin,
        inlineNotePlugin,
        noteBlockPlugin,
        titleFormatPlugin,
        oneDark,
      ],
    });

    // Listen to changes in active note as well as its text, and notify the worker as required
    let unsubscribeFromNoteTextChange: () => void;
    const unsubscribeFromActiveNoteIdChange = store.activeNoteId.$onChangeImmediate((activeNoteId, previousNoteId) => {
      tagsWorker.removeNote(previousNoteId);
      const note = store.$state.notes.findOrThrow(n => n.id === activeNoteId);
      codeMirror.current!.dispatch({ changes: { from: 0, to: codeMirror.current!.state.doc.length, insert: note.text } });
      unsubscribeFromNoteTextChange?.();
      unsubscribeFromNoteTextChange = store.notes.$find.id.$eq(activeNoteId).text.$onChangeImmediate(text => {
        tagsWorker.updateNote({ ...note, text });
      });
    })

    // Listen to changes in tags and synonyms, and notify the worker as required
    const previousPositions = new Array<{ from: number, to: number, type: tagType }>();
    const reviseTagsInEditor = () => doReviseTagsInEditor(store, codeMirror.current!, latestTagsFromWorker, previousPositions);
    const latestTagsFromWorker = new Array<TagSummary>();
    const unsubscribeFromWorker = tagsWorker.addListener(async event => {
      if (event.data.noteId !== store.$state.activeNoteId) return;
      latestTagsFromWorker.length = 0;
      latestTagsFromWorker.push(...event.data.tags);
      const { noteTags: oldNoteTags, tags: oldTags } = store.$state;
      const oldNoteTagTagIds = oldNoteTags.filter(nt => nt.noteId === event.data.noteId).map(nt => nt.tagId).distinct().sort();
      const incomingNoteTagTagIds = event.data.tags.map(t => t.id).distinct().sort();
      const addTagIds = incomingNoteTagTagIds.filter(id => !oldNoteTagTagIds.includes(id));
      const removeTagIds = oldNoteTagTagIds.filter(id => !incomingNoteTagTagIds.includes(id));
      const oldSynonymIds = oldTags.filter(tag => oldNoteTagTagIds.includes(tag.id)).map(t => t.synonymId).distinct().sort();
      if (addTagIds.length || removeTagIds.length) {
        const apiResponse = await updateNoteTags(event.data.noteId, addTagIds, removeTagIds);
        await writeToStoreAndDb(store, apiResponse);
      }
      const { noteTags: newNoteTags, tags: newTags } = store.$state;
      const newNoteTagTagIds = newNoteTags.filter(nt => nt.noteId === event.data.noteId).map(nt => nt.tagId).distinct().sort();
      const newSynonymIds = newTags.filter(tag => newNoteTagTagIds.includes(tag.id)).map(t => t.synonymId).distinct().sort();
      const synonymIdsHaveChanged = JSON.stringify(oldSynonymIds) !== JSON.stringify(newSynonymIds);
      if (synonymIdsHaveChanged) {
        store.synonymIds.$set(newSynonymIds);
      } else {
        console.log('!worker.onmessage')
        reviseTagsInEditor();
      }
    })
    const unsubscribeFromSynonymIdsChange = store.synonymIds.$onChange(() => {
      console.log('!store.synonymIds.$onChange')
      reviseTagsInEditor();
    });
    const unsubscribeFromSynonymGroupsChange = store.synonymGroups.$onChange(() => {
      console.log('!store.synonymGroups.$onChange');
      reviseTagsInEditor();
    });

    // Cleanup
    return () => {
      unsubscribeFromWorker();
      unsubscribeFromNoteTextChange?.();
      unsubscribeFromActiveNoteIdChange();
      unsubscribeFromSynonymIdsChange();
      unsubscribeFromSynonymGroupsChange();
      codeMirror.current?.destroy();
      tagsWorker.removeNote(store.$state.activeNoteId);
    }
  }, [store, local, isMounted, hasNote, tagsWorker]);

  return {
    store,
    local,
    notify,
    ...local.$state,
    mayDeleteNote: !!notes.length,
    popupRef,
    stateInitialized,
    editorRef,
    codeMirror: codeMirror.current,
  };
}
