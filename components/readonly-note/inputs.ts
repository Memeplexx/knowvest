import { oneDark } from '@/utils/codemirror-theme';
import { bulletPointPlugin, inlineNotePlugin, noteBlockPlugin, reviseEditorTags, titleFormatPlugin } from '@/utils/codemirror-utils';
import { useComponent } from '@/utils/react-utils';
import { useStore } from '@/utils/store-utils';
import { markdown } from '@codemirror/lang-markdown';
import { defaultHighlightStyle, syntaxHighlighting } from '@codemirror/language';
import { languages as codeLanguages } from '@codemirror/language-data';
import { EditorState } from '@codemirror/state';
import { EditorView } from '@codemirror/view';
import { Highlighter } from '@lezer/highlight';
import { useRef } from 'react';
import { Props } from './constants';


export const useInputs = (props: Props) => {

  const { store } = useStore();
  const editorRef = useRef<HTMLDivElement>(null);
  const component = useComponent();
  const isDone = useRef(false)
  const result = { editorRef, editor: null as EditorView | null };

  // Do not instantiate the editor until certain conditions are met
  if (!component.isMounted)
    return result;
  if (props.if === false)
    return result;
  if (isDone.current)
    return result;

  // Instantiate the editor
  const editor = new EditorView({
    doc: props.note!.text,
    parent: editorRef.current!,
    extensions: [
      syntaxHighlighting(defaultHighlightStyle as Highlighter, { fallback: true }),
      markdown({ codeLanguages }),
      EditorState.readOnly.of(true),
      EditorView.lineWrapping,
      bulletPointPlugin,
      inlineNotePlugin,
      noteBlockPlugin,
      titleFormatPlugin,
      oneDark,
    ],
  });
  component.listen = () => editor.destroy();
  const id = props.note!.id;
  component.listen = store.noteTags[id]!
    .$onChange(() => reviseEditorTags(store, editor, id));
  component.listen = store.synonymIds
    .$onChange(() => reviseEditorTags(store, editor, id));
  component.listen = store.synonymGroups
    .$onChange(() => reviseEditorTags(store, editor, id));
  component.listen = store.tags
    .$onChange(() => reviseEditorTags(store, editor, id));
  reviseEditorTags(store, editor, id);
  isDone.current = true;
  return {
    ...result,
    editor
  };
}
