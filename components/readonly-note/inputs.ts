import { oneDark } from '@/utils/codemirror-theme';
import { bulletPointPlugin, inlineNotePlugin, noteBlockPlugin, reviseEditorTags, titleFormatPlugin } from '@/utils/codemirror-utils';
import { listenToTagsForEditor } from '@/utils/data-utils';
import { useIsomorphicLayoutEffect } from '@/utils/react-utils';
import { useStore } from '@/utils/store-utils';
import { markdown } from '@codemirror/lang-markdown';
import { defaultHighlightStyle, syntaxHighlighting } from '@codemirror/language';
import { languages } from '@codemirror/language-data';
import { EditorState } from '@codemirror/state';
import { EditorView } from '@codemirror/view';
import { Highlighter } from '@lezer/highlight';
import { useRef } from 'react';
import { Props } from './constants';


export const useInputs = (props: Props) => {

  const { store } = useStore();

  const editorRef = useRef<HTMLDivElement>(null);
  const codeMirror = useRef<EditorView | null>(null);

  useIsomorphicLayoutEffect(() => {
    if (props.if === false)
      return; /* do not instantiate because component has been hidden */
    codeMirror.current = new EditorView({
      doc: props.note!.text,
      parent: editorRef.current!,
      extensions: [
        syntaxHighlighting(defaultHighlightStyle as Highlighter, { fallback: true }),
        markdown({ codeLanguages: languages }),
        EditorState.readOnly.of(true),
        EditorView.lineWrapping,
        bulletPointPlugin,
        inlineNotePlugin,
        noteBlockPlugin,
        titleFormatPlugin,
        oneDark,
      ],
    });
    return () => codeMirror.current?.destroy();
  }, [editorRef.current, props.if]);

  useIsomorphicLayoutEffect(() => {
    if (props.if === false)
      return; /* do not instantiate because component has been hidden */
    return listenToTagsForEditor({ editorView: codeMirror.current!, store, reviseEditorTags });
  }, [editorRef.current, props.if]);

  return {
    editorRef,
  }
}
