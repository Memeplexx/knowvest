import { oneDark } from '@/utils/codemirror-theme';
import { bulletPointPlugin, inlineNotePlugin, noteBlockPlugin, reviseEditorTags, titleFormatPlugin } from '@/utils/codemirror-utils';
import { listenToTagsForEditor } from '@/utils/data-utils';
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
import { useEffect, useRef } from 'react';
import { PopupHandle } from '../popup/constants';
import { initialState } from './constants';
import { autocompleteExtension, createNotePersisterExtension, editorHasTextUpdater, noteTagsPersisterExtension, pasteListener, textSelectorPlugin } from './shared';


export const useInputs = () => {

  const { store, state: { activeNoteId, notes, stateInitialized } } = useStore();
  const { local } = useLocalStore('activePanel', initialState);

  const popupRef = useRef<PopupHandle>(null);
  const editorRef = useRef<HTMLDivElement>(null);
  const codeMirror = useRef<EditorView | null>(null);
  
  useEffect(() => {
    if (!activeNoteId) return;
    codeMirror.current = new EditorView({
      doc: store.$state.notes.findOrThrow(n => n.id === activeNoteId).text,
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
    codeMirror.current.dispatch({ selection: { anchor: codeMirror.current.state.doc.length } });
    if (!/iPhone|iPad|iPod|Android/i.test(navigator.userAgent))
      codeMirror.current.focus();
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
    mayDeleteNote: !!notes.length,
    popupRef,
    stateInitialized,
    editorRef,
    codeMirror: codeMirror.current,
  };
}
