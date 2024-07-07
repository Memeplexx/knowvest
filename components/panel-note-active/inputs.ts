import { oneDark } from '@/utils/codemirror-theme';
import { bulletPointPlugin, inlineNotePlugin, noteBlockPlugin, reviseEditorTags, titleFormatPlugin } from '@/utils/codemirror-utils';
import { useComponent } from '@/utils/react-utils';
import { store, useLocalStore, useStore } from '@/utils/store-utils';
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
import { useRouter } from 'next/navigation';
import { derive } from 'olik/derive';
import { useEffect, useMemo, useRef } from 'react';
import { useNotifier } from '../overlay-notifier';
import { PopupHandle } from '../overlay-popup/constants';
import { initialState } from './constants';
import { autocompleteExtension, createNotePersisterExtension, pasteListener, textSelectorPlugin } from './shared';


export const useInputs = () => {

  const { notes, tags, activeNoteId, flashCards } = useStore();
  const { local, state } = useLocalStore('activePanel', initialState);
  const notify = useNotifier();
  const popupRef = useRef<PopupHandle>(null);
  const editorRef = useRef<HTMLDivElement>(null);
  const component = useComponent();
  const editor = useRef<EditorView | null>(null);
  const router = useRouter();
  const selectionIsTag = useMemo(() => {
    return tags.some(t => t.text === state.selection);
  }, [state.selection, tags]);
  const noteFlashCards = useMemo(() => {
    return flashCards
      .filter(fc => fc.noteId === activeNoteId)
      .sort((a, b) => b.dateUpdated.getTime() - a.dateUpdated.getTime());
  }, [activeNoteId, flashCards]);
  const canCreateFlashCard = useMemo(() => {
    return noteFlashCards.every(fc => !!fc.text.trim().length);
  }, [noteFlashCards]);
  useEffect(() => store.activeNoteId.$onChange(activeNoteId => editor.current!.dispatch({
    changes: {
      from: 0,
      to: editor.current!.state.doc.length,
      insert: store.$state.notes.findOrThrow(n => n.id === activeNoteId).text
    }
  })), []);
  const result = {
    local,
    notify,
    canCreateFlashCard,
    ...state,
    mayDeleteNote: !!notes.length,
    popupRef,
    editorRef,
    editor: editor.current,
    selectionIsTag,
    noteFlashCards,
    router,
  };

  // Do not instantiate the editor until certain conditions are met
  if (!component.isMounted)
    return result;
  if (component.hasStartedAsyncProcess)
    return result;

  editor.current = new EditorView({
    doc: notes.findOrThrow(n => n.id === activeNoteId).text,
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
      autocompleteExtension,
      createNotePersisterExtension(500),
      textSelectorPlugin(local),
      pasteListener,
      bulletPointPlugin,
      inlineNotePlugin,
      noteBlockPlugin,
      titleFormatPlugin,
      oneDark,
    ],
  });

  component.listen = () => editor.current!.destroy();
  const doRemoveEditorTags = () => reviseEditorTags({ codeMirror: editor.current!, noteId: store.$state.activeNoteId, synonymIds: store.synonymIds.$state });
  component.listen = store.synonymIds.$onChange(doRemoveEditorTags);
  component.listen = store.synonymGroups.$onChange(doRemoveEditorTags);
  component.listen = derive(store.activeNoteId, store.searchResults)
    .$with((activeNoteId, searchResults) => searchResults.filter(nt => nt.noteId === activeNoteId))
    .$onChange(doRemoveEditorTags);
  component.listen = store.activeNoteId.$onChange(activeNoteId => editor.current!.dispatch({
    changes: {
      from: 0,
      to: editor.current!.state.doc.length,
      insert: store.$state.notes.findOrThrow(n => n.id === activeNoteId).text
    }
  }));
  doRemoveEditorTags();
  component.completeAsyncProcess();

  return result;
}
