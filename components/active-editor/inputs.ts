import { NoteId } from '@/server/dtos';
import { bulletPointPlugin, inlineNotePlugin, noteBlockPlugin, titleFormatPlugin } from '@/utils/codemirror-extensions';
import { oneDark } from '@/utils/codemirror-theme';
import { addAriaAttributeToCodeMirror, highlightTagsInEditor } from '@/utils/functions';
import { NotificationContext } from '@/utils/pages/home/constants';
import { store } from '@/utils/store';
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
import { derive } from 'olik/derive';
import { useContext, useEffect, useRef } from 'react';
import { autocompleteExtension, createNotePersisterExtension, editorHasTextUpdater, noteTagsPersisterExtension, pasteListener, textSelectorPlugin } from './shared';


export const useInputs = () => {

  const mayDeleteNote = derive(store.notes).$with(notes => !!notes.length);

  const state = store.activePanel.$useState();

  const editor = useRef<HTMLDivElement>(null);

  const codeMirror = useRef<EditorView | null>(null);

  useEffect(() => {
    if (codeMirror.current) { return; /* defend against re-render when React strictMode is set to true */ }
    codeMirror.current = instantiateCodeMirror({ editor: editor.current! });
    updateEditorWhenActiveIdChanges({ codeMirror: codeMirror.current! });
    highlightTagsInEditor({ editorView: codeMirror.current!, synonymIds: store.synonymIds });
    addAriaAttributeToCodeMirror({ editor: editor.current!, noteId: store.$state.activeNoteId });
  }, []);

  return {
    refs: {
      editor,
    },
    state: {
      ...state,
      mayDeleteNote: mayDeleteNote.$useState(),
      codeMirror: codeMirror.current,
    },
    notify: useContext(NotificationContext)!,
  };
}

export const instantiateCodeMirror = ({ editor }: { editor: HTMLDivElement }) => {
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
      autocompleteExtension,
      noteTagsPersisterExtension(),
      createNotePersisterExtension({ debounce: 500 }),
      textSelectorPlugin,
      editorHasTextUpdater,
      pasteListener,
      bulletPointPlugin,
      inlineNotePlugin,
      noteBlockPlugin,
      titleFormatPlugin,
      oneDark,
    ],
  });
}

export const updateEditorWhenActiveIdChanges = ({ codeMirror }: { codeMirror: EditorView }) => {
  const changeListener = (activeNoteId: NoteId) => {
    codeMirror.dispatch(
      {
        changes: {
          from: 0,
          to: codeMirror.state.doc.length,
          insert: store.$state.notes.findOrThrow(n => n.id === activeNoteId).text,
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
  changeListener(store.$state.activeNoteId);
  store.activeNoteId.$onChange(changeListener);
}

