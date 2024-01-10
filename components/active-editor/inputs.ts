import { bulletPointPlugin, inlineNotePlugin, noteBlockPlugin, titleFormatPlugin } from '@/utils/codemirror-extensions';
import { oneDark } from '@/utils/codemirror-theme';
import { highlightTagsInEditor } from '@/utils/functions';
import { NotificationContext } from '@/utils/pages/home/constants';
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
import { languages } from '@codemirror/language-data';
import { lintKeymap } from '@codemirror/lint';
import {
  EditorView,
  crosshairCursor,
  dropCursor,
  keymap,
  rectangularSelection
} from '@codemirror/view';
import { useContext, useEffect, useRef } from 'react';
import { autocompleteExtension, createNotePersisterExtension, editorHasTextUpdater, noteTagsPersisterExtension, pasteListener, textSelectorPlugin } from './shared';
import { Store } from 'olik';
import { AppState } from '@/utils/constants';
import { useStore } from '@/utils/hooks';
import { initialState } from '../active-panel/constants';


export const useInputs = () => {

  const { store, notes } = useStore<typeof initialState>();
  const mayDeleteNote = !!notes.length;
  const editorRef = useRef<HTMLDivElement>(null);
  const codeMirror = useRef<EditorView | null>(null);
  const { selection, loadingSelection } = store.activePanel.$state;

  useEffect(() => {
    codeMirror.current = instantiateCodeMirror({ editor: editorRef.current!, store });
    updateEditorWhenActiveIdChanges({ codeMirror: codeMirror.current!, store });
    const sub = highlightTagsInEditor({ editorView: codeMirror.current!, store });
    return () => {
      codeMirror.current?.destroy();
      sub.unsubscribe();
    }
  }, [store]);

  return {
    store,
    editorRef,
    mayDeleteNote,
    codeMirror: codeMirror.current,
    notify: useContext(NotificationContext)!,
    selection,
    loadingSelection,
  };
}

export const instantiateCodeMirror = ({ editor, store }: { editor: HTMLDivElement, store: Store<AppState & typeof initialState> }) => {
  return new EditorView({
    doc: '',
    parent: editor,
    extensions: [
      history(),
      dropCursor(),
      indentOnInput(),
      syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
      markdown({ codeLanguages: languages }),
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
    if (!store.$state.notes.length || !store.$state.activeNoteId) { return; }
    codeMirror.dispatch(
      {
        changes: {
          from: 0,
          to: codeMirror.state.doc.length,
          insert: store.$state.notes.findOrThrow(n => n.id === store.$state.activeNoteId).text,
        },
      },
      {
        selection: {
          anchor: codeMirror.state.doc.length
        }
      },
    );
    codeMirror.focus();
  };
  updateEditorText();
  store.activeNoteId.$onChange(updateEditorText);
}

