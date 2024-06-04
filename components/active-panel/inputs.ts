import { oneDark } from '@/utils/codemirror-theme';
import { bulletPointPlugin, doReviseTagsInEditor, inlineNotePlugin, noteBlockPlugin, titleFormatPlugin } from '@/utils/codemirror-utils';
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
import { derive } from 'olik/derive';
import { useRef } from 'react';
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
  component.listen = store.synonymIds
    .$onChange(() => doReviseTagsInEditor(store, editorView, store.$state.activeNoteId));
  component.listen = store.synonymGroups
    .$onChange(() => doReviseTagsInEditor(store, editorView, store.$state.activeNoteId));
  component.listen = derive(store.activeNoteId, store.noteTags)
    .$with((activeNoteId, noteTags) => noteTags[activeNoteId]!)
    .$onChangeImmediate(() => doReviseTagsInEditor(store, editorView, store.$state.activeNoteId));
  component.listen = store.activeNoteId
    .$onChangeImmediate(activeNoteId => editorView.dispatch({
      changes: {
        from: 0,
        to: editorView.state.doc.length,
        insert: store.$state.notes.findOrThrow(n => n.id === activeNoteId).text
      }
    }));
  component.done();

  return {
    ...result,
    editorView,
  };
}
