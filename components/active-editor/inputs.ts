import { oneDark } from '@/utils/codemirror-theme';
import { bulletPointPlugin, inlineNotePlugin, noteBlockPlugin, reviseEditorTags, titleFormatPlugin } from '@/utils/codemirror-utils';
import { listenToTagsForEditor } from '@/utils/data-utils';
import { AppState, useStore } from '@/utils/store-utils';
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
import { Store } from 'olik';
import { useEffect, useRef } from 'react';
import { initialState } from '../active-panel/constants';
import { useNotifier } from '../notifier';
import { ActivePanelStore } from './constants';
import { autocompleteExtension, createNotePersisterExtension, editorHasTextUpdater, noteTagsPersisterExtension, pasteListener, textSelectorPlugin } from './shared';


export const useInputs = () => {

  const { store, notes, activePanel } = useStore<typeof initialState>();
  const mayDeleteNote = !!notes.length;
  const editorRef = useRef<HTMLDivElement>(null);
  const codeMirror = useRef<EditorView | null>(null);
  
  useEffect(() => {
    codeMirror.current = instantiateCodeMirror({ editor: editorRef.current!, store });
    updateEditorWhenActiveIdChanges({ codeMirror: codeMirror.current!, store });
    const changeListener = listenToTagsForEditor({ editorView: codeMirror.current!, store, reviseEditorTags });
    return () => {
      codeMirror.current?.destroy();
      changeListener.unsubscribe();
    }
  }, [store]);

  return {
    store,
    editorRef,
    mayDeleteNote,
    codeMirror: codeMirror.current,
    notify: useNotifier(),
    ...activePanel,
  };
}

export const instantiateCodeMirror = ({ editor, store }: { editor: HTMLDivElement, store: ActivePanelStore }) => {
  return new EditorView({
    doc: '',
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
      createNotePersisterExtension({ debounce: 500, store }),
      textSelectorPlugin(store),
      editorHasTextUpdater(store),
      pasteListener,
      bulletPointPlugin,
      inlineNotePlugin,
      noteBlockPlugin,
      titleFormatPlugin,
      oneDark,
    ],
  });
}

export const updateEditorWhenActiveIdChanges = ({ codeMirror, store }: { store: Store<AppState>, codeMirror: EditorView }) => {
  const updateEditorText = () => {
    const { notes, activeNoteId } = store.$state;
    if (!notes.length || !activeNoteId) { return; }
    codeMirror.dispatch(
      {
        changes: {
          from: 0,
          to: codeMirror.state.doc.length,
          insert: notes.findOrThrow(n => n.id === activeNoteId).text,
        },
      },
      {
        selection: {
          anchor: codeMirror.state.doc.length
        }
      },
    );
    if (!/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
      codeMirror.focus();
    }
  };
  updateEditorText();
  store.activeNoteId.$onChange(updateEditorText);
}

