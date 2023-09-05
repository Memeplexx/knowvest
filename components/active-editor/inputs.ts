import { NoteId } from '@/server/dtos';
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
  HighlightStyle,
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
import { Tag, tags } from '@lezer/highlight';
import { derive } from 'olik';
import { useContext, useEffect, useRef } from 'react';
import { createAutocompleteExtension, createEditorHasTextUpdater, createNotePersisterExtension, noteTagsPersisterExtension as createNoteTagsPersisterExtension, createPasteListener, createSentenceCapitalizer, createTextSelectorPlugin } from './shared';


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

const myTag = Tag.define();

const myHighlightStyle = HighlightStyle.define([
  { tag: tags.comment, color: "#16A004", fontStyle: "italic" },
  { tag: tags.emphasis, color: "#66D9EF", fontStyle: "italic" },
  { tag: tags.strong, color: "#66D9EF", fontStyle: "bold" },
  { tag: myTag, color: "#FF0000", fontStyle: "bold" },
]);

export const instantiateCodeMirror = ({ editor }: { editor: HTMLDivElement }) => {
  return new EditorView({
    doc: '',
    parent: editor,
    extensions: [
      history(),
      dropCursor(),
      indentOnInput(),
      syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
      bracketMatching(),
      closeBrackets(),
      rectangularSelection(),
      crosshairCursor(),
      markdown({ codeLanguages: languages }),
      syntaxHighlighting(myHighlightStyle),
      EditorView.lineWrapping,
      EditorView.contentAttributes.of({ spellcheck: "on"/*, autocapitalize: "on" - doesn't work as expected! */ }),
      keymap.of([...closeBracketsKeymap, ...defaultKeymap, ...historyKeymap, ...foldKeymap, ...completionKeymap, ...lintKeymap]),
      createAutocompleteExtension(),
      createNoteTagsPersisterExtension(),
      createNotePersisterExtension({ debounce: 500 }),
      createTextSelectorPlugin(),
      createEditorHasTextUpdater(),
      createPasteListener(),
      createSentenceCapitalizer(),
    ],
  });
}

export const updateEditorWhenActiveIdChanges = ({ codeMirror }: { codeMirror: EditorView }) => {
  const changeListener = (activeNoteId: NoteId) => {
    // update document text
    codeMirror.dispatch({
      changes: {
        from: 0,
        to: codeMirror.state.doc.length,
        insert: store.$state.notes.findOrThrow(n => n.id === activeNoteId).text,
      },
    });
    // reset selection if there is one
    codeMirror.dispatch({
      selection: {
        anchor: codeMirror.state.doc.length
      }
    });
    codeMirror.focus();
  };
  changeListener(store.$state.activeNoteId);
  store.activeNoteId.$onChange(changeListener);
}

