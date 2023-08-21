import { HomeContext, OlikContext } from '@/utils/pages/home/constants';
import { useNoteTagsToTagHighlighter } from '@/utils/hooks';
import { AppStoreState } from '@/utils/types';
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
import { Store, derive } from 'olik';
import { useNestedStore } from 'olik-react';
import { useContext, useEffect, useRef } from 'react';
import { createTheme } from 'thememirror';
import { codeMirrorTheme, initialState } from './constants';
import { createAutocompleteExtension, createBulletPointPlugin, createNotePersisterExtension, noteTagsPersisterExtension as createNoteTagsPersisterExtension, createTextSelectorPlugin } from './functions';



export const useHooks = () => {

  const floating = useFloating<HTMLButtonElement>({ placement: 'bottom-end' });

  const appStore = useContext(OlikContext)!;

  const mayDeleteNote = derive(appStore.notes).$with(notes => !!notes.length);

  const { store, state } = useNestedStore(initialState).usingAccessor(s => s.active);

  const editorDomElement = useRef<HTMLDivElement>(null);

  const codeMirror = useCodeMirror(editorDomElement, store, appStore);

  useNoteTagsToTagHighlighter(codeMirror, appStore.synonymIds);

  useActiveNoteIdToCodeMirrorUpdater(codeMirror);

  return {
    mayDeleteNote: mayDeleteNote.$useState(),
    floating,
    editorDomElement,
    store,
    codeMirror,
    ...useContext(HomeContext)!,
    ...state,
    appStore,
  };
}

export const useCodeMirror = (
  editorDomElement: React.RefObject<HTMLDivElement>,
  store: Store<typeof initialState['active']>,
  appStore: Store<AppStoreState>,
) => {
  const editorRef = useRef<EditorView | null>(null);
  useEffect(() => {
    if (!editorDomElement.current) { return; }
    if (editorRef.current) { editorRef.current.destroy(); }
    editorRef.current = new EditorView({
      doc: appStore.notes.$find.id.$eq(appStore.activeNoteId.$state).text.$state,
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
        keymap.of([ ...closeBracketsKeymap, ...defaultKeymap, ...historyKeymap, ...foldKeymap, ...completionKeymap, ...lintKeymap ]),
        createAutocompleteExtension({ appStore }),
        createNoteTagsPersisterExtension({ appStore }),
        createBulletPointPlugin(),
        createNotePersisterExtension({ debounce: 500, activeStore: store, appStore }),
        createTextSelectorPlugin(store),
        myTheme,
      ],
    });
  }, [appStore, editorDomElement, store]);
  return editorRef.current;
}

export const useActiveNoteIdToCodeMirrorUpdater = (
  codeMirror: EditorView | null,
) => {
  const appStore = useContext(OlikContext)!;
  const activeNoteId = appStore.activeNoteId.$useState();
  const activeNoteIdRef = useRef(0);
  if (activeNoteIdRef.current !== activeNoteId && codeMirror) {
    // update document text
    codeMirror?.dispatch({
      changes: {
        from: 0,
        to: codeMirror.state.doc.length,
        insert: appStore.notes.$find.id.$eq(appStore.activeNoteId.$state).$state.text || '',
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

const myTheme = createTheme(codeMirrorTheme);