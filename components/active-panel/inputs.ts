import { oneDark } from '@/utils/codemirror-theme';
import { bulletPointPlugin, doReviseTagsInEditor, inlineNotePlugin, noteBlockPlugin, tagType, titleFormatPlugin } from '@/utils/codemirror-utils';
import { useComponent } from '@/utils/react-utils';
import { useLocalStore, useStore } from '@/utils/store-utils';
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
import { useRef } from 'react';
import { TagResult } from '../../utils/tags-worker';
import { useNotifier } from '../notifier';
import { PopupHandle } from '../popup/constants';
import { initialState } from './constants';
import { autocompleteExtension, createNotePersisterExtension, pasteListener, textSelectorPlugin } from './shared';



export const useInputs = () => {

  const { store, state: { notes } } = useStore();
  const { local } = useLocalStore('activePanel', initialState);
  const notify = useNotifier();
  const popupRef = useRef<PopupHandle>(null);
  const editorRef = useRef<HTMLDivElement>(null);
  const hasNote = !!store.$state.activeNoteId;
  const component = useComponent();
  const result = {
    store,
    local,
    notify,
    ...local.$state,
    mayDeleteNote: !!notes.length,
    popupRef,
    editorRef,
    editorView: null as EditorView | null,
  };

  // Do not instantiate the editor until certain conditions are met
  if (!component.isMounted)
    return result;
  if (!hasNote)
    return result;
  if (!component.isPristine)
    return result;

  component.start();
  const editorView = new EditorView({
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
      pasteListener,
      bulletPointPlugin,
      inlineNotePlugin,
      noteBlockPlugin,
      titleFormatPlugin,
      oneDark,
    ],
  });
  component.listen = () => editorView.destroy();
  const previousPositions = new Array<TagResult & { type?: tagType }>();
  const latestTagsFromWorker = new Array<TagResult & { type?: tagType }>();
  const reviseTagsInEditor = () => doReviseTagsInEditor(store, editorView, latestTagsFromWorker, previousPositions);

  // Listen to changes in active note as well as its tag notes, and notify the worker as required
  let unsubscribeFromNoteTextChange: () => void;
  component.listen = store.activeNoteId.$onChangeImmediate(activeNoteId => {
    const note = store.$state.notes.findOrThrow(n => n.id === activeNoteId);
    editorView.dispatch({ changes: { from: 0, to: editorView.state.doc.length, insert: note.text } });
    unsubscribeFromNoteTextChange?.();
    unsubscribeFromNoteTextChange = store.tagNotes[activeNoteId]!.$onChangeImmediate(current => {
      latestTagsFromWorker.length = 0;
      latestTagsFromWorker.push(...current);
      reviseTagsInEditor();
      previousPositions.length = 0;
      previousPositions.push(...current);
    });
  })

  // Listen to changes in tags and synonyms, and notify the worker as required
  component.listen = store.synonymIds.$onChange(reviseTagsInEditor);
  component.listen = store.synonymGroups.$onChange(reviseTagsInEditor);
  component.done();
  return {
    ...result,
    editorView,
  };
}
