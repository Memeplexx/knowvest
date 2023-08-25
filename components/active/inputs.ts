import { NotificationContext } from '@/utils/pages/home/constants';
import { useNoteTagsToTagHighlighter } from '@/utils/hooks';
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
import { EditorState } from '@codemirror/state';
import {
  EditorView,
  crosshairCursor,
  dropCursor,
  keymap,
  rectangularSelection
} from '@codemirror/view';
import { useFloating } from '@floating-ui/react';
import { derive } from 'olik';
import { useContext, useEffect, useRef } from 'react';
import { createAutocompleteExtension, createNotePersisterExtension, noteTagsPersisterExtension as createNoteTagsPersisterExtension, createTextSelectorPlugin, createEditorHasTextUpdater, createPasteListener, createSentenceCapitalizer } from './shared';
import { store } from '@/utils/store';



export const useInputs = () => {

  const floating = useFloating<HTMLButtonElement>({ placement: 'bottom-end' });

  const mayDeleteNote = derive(store.notes).$with(notes => !!notes.length);

  const state = store.activePanel.$useState();

  const editor = useRef<HTMLDivElement>(null);

  const codeMirror = useCodeMirror(editor);

  useNoteTagsToTagHighlighter(codeMirror, store.synonymIds);

  useActiveNoteIdToCodeMirrorUpdater(codeMirror);

  return {
    refs: {
      floating,
      editor,
    },
    state: {
      ...state,
      mayDeleteNote: mayDeleteNote.$useState(),
      codeMirror,
    },
    notify: useContext(NotificationContext)!,
  };
}

export const useCodeMirror = (editorDomElement: React.RefObject<HTMLDivElement>) => {
  const editorRef = useRef<EditorView | null>(null);
  useEffect(() => {
    if (!editorDomElement.current) { return; }
    if (editorRef.current) { editorRef.current.destroy(); }
    editorRef.current = new EditorView({
      doc: store.$state.notes.find(n => n.id === store.$state.activeNoteId)?.text,
      parent: editorDomElement.current!,
      extensions: [
        history(),
        dropCursor(),
        EditorState.allowMultipleSelections.of(true),
        indentOnInput(),
        syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
        bracketMatching(),
        closeBrackets(),
        rectangularSelection(),
        crosshairCursor(),
        markdown({ codeLanguages: languages }),
        EditorView.lineWrapping,
        EditorView.contentAttributes.of({ spellcheck: "on"/*, autocapitalize: "on" - doesn't work as I expected! */ }),
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
  }, [editorDomElement]);
  return editorRef.current;
}

export const useActiveNoteIdToCodeMirrorUpdater = (
  codeMirror: EditorView | null,
) => {
  const activeNoteId = store.activeNoteId.$useState();
  const activeNoteIdRef = useRef(0);
  if (activeNoteIdRef.current !== activeNoteId && codeMirror) {
    // update document text
    codeMirror?.dispatch({
      changes: {
        from: 0,
        to: codeMirror.state.doc.length,
        insert: store.$state.notes.findOrThrow(n => n.id === store.$state.activeNoteId).text,
      },
    });
    // reset selection if there is one
    codeMirror?.dispatch({
      selection: {
        anchor: codeMirror.state.doc.length
      }
    });
    codeMirror?.focus();
  }
  activeNoteIdRef.current = activeNoteId;
}
