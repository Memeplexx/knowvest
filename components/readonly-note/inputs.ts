import { NoteDTO } from '@/actions/types';
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
import { useRef } from 'react';
import { Props } from './constants';
import { Highlighter } from '@lezer/highlight';


export const useInputs = (props: Props) => {

  const { store } = useStore();

  const editorRef = useRef<HTMLDivElement>(null);
  const codeMirror = useRef<EditorView | null>(null);

  useIsomorphicLayoutEffect(() => {
    if (props.showIf === false) return; /* do not instantiate because component has been hidden */
    codeMirror.current = instantiateCodeMirror({ editor: editorRef.current!, note: props.note! });
    return () => codeMirror.current?.destroy();
  }, [editorRef.current, props.showIf]);

  useIsomorphicLayoutEffect(() => {
    if (props.showIf === false) return; /* do not instantiate because component has been hidden */
    const changeListener = listenToTagsForEditor({ editorView: codeMirror.current!, store, reviseEditorTags });
    return () => changeListener.unsubscribe();
  }, [editorRef.current, props.showIf]);

  return {
    editorRef,
    props,
  }
}

export const instantiateCodeMirror = ({ editor, note }: { editor: HTMLDivElement, note: NoteDTO }) => {
  return new EditorView({
    doc: note.text,
    parent: editor,
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
}

