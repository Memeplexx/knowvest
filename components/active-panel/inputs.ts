import { AppState, useLocalStore, useStore } from '@/utils/store-utils';
import { useEffect, useRef } from 'react';
import { PopupHandle } from '../popup/constants';
import { ActivePanelStore, initialState } from './constants';
import { listenToTagsForEditor } from '@/utils/data-utils';
import { oneDark } from '@/utils/codemirror-theme';
import { bulletPointPlugin, inlineNotePlugin, noteBlockPlugin, reviseEditorTags, titleFormatPlugin } from '@/utils/codemirror-utils';
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
import { autocompleteExtension, createNotePersisterExtension, editorHasTextUpdater, noteTagsPersisterExtension, pasteListener, textSelectorPlugin } from './shared';
import { NoteId } from '@/actions/types';
import { StoreDef } from 'olik';


export const useInputs = () => {

  const { store, state: { activeNoteId, notes, stateInitialized } } = useStore();
  const { local } = useLocalStore('activePanel', initialState);
  const popupRef = useRef<PopupHandle>(null);
  
  const mayDeleteNote = !!notes.length;
  const editorRef = useRef<HTMLDivElement>(null);
  const codeMirror = useRef<EditorView | null>(null);

  useEffect(() => {
    if (!activeNoteId) return;
    codeMirror.current = instantiateCodeMirror({ editor: editorRef.current!, store, local, activeNoteId });
    return () => codeMirror.current?.destroy();
  }, [store, activeNoteId, local]);

  useEffect(() => {
    if (!activeNoteId) return;
    const changeListener = listenToTagsForEditor({ editorView: codeMirror.current!, store, reviseEditorTags });
    return () => changeListener.unsubscribe();
  }, [store, activeNoteId]);

  return {
    store,
    local,
    ...local.$state,
    activeNoteId,
    mayDeleteNote,
    popupRef,
    stateInitialized,
    editorRef,
    codeMirror: codeMirror.current,
  };
}

export const instantiateCodeMirror = ({ editor, store, local, activeNoteId }: { editor: HTMLDivElement, store: StoreDef<AppState>, local: ActivePanelStore, activeNoteId: NoteId }) => {
  const result = new EditorView({
    doc: store.$state.notes.findOrThrow(n => n.id === activeNoteId).text,
    parent: editor,
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
      EditorView.contentAttributes.of({ spellcheck: "on", autocapitalize: "on" }),
      keymap.of([...closeBracketsKeymap, ...defaultKeymap, ...historyKeymap, ...foldKeymap, ...completionKeymap, ...lintKeymap]),
      autocompleteExtension(store),
      noteTagsPersisterExtension(store),
      createNotePersisterExtension({ debounce: 500, store, local }),
      textSelectorPlugin({local}),
      editorHasTextUpdater({local}),
      pasteListener,
      bulletPointPlugin,
      inlineNotePlugin,
      noteBlockPlugin,
      titleFormatPlugin,
      oneDark,
    ],
  });
  result.dispatch({ selection: { anchor: result.state.doc.length } });
  if (!/iPhone|iPad|iPod|Android/i.test(navigator.userAgent))
    result.focus();
  return result;
}
