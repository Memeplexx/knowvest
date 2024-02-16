"use client";

import { NoteDTO } from '@/server/dtos';
import { highlightTagsInEditor } from '@/utils/functions';
import { useIsomorphicLayoutEffect } from '@/utils/hooks';
import { oneDark } from '@/utils/codemirror-theme';
import { markdown } from '@codemirror/lang-markdown';
import { defaultHighlightStyle, syntaxHighlighting } from '@codemirror/language';
import { languages } from '@codemirror/language-data';
import { EditorState } from '@codemirror/state';
import { EditorView } from '@codemirror/view';
import { useContext, useRef } from 'react';
import { Props } from './constants';
import { bulletPointPlugin, inlineNotePlugin, noteBlockPlugin, titleFormatPlugin } from '@/utils/codemirror-extensions';
import { StoreContext } from '@/utils/constants';


export const useInputs = (props: Props) => {

  const { store } = useContext(StoreContext)!;

  const editorRef = useRef<HTMLDivElement>(null);
  const codeMirror = useRef<EditorView | null>(null);

  useIsomorphicLayoutEffect(() => {
    if (props.showIf === false) { return; /* do not instantiate because component has been hidden */ }
    codeMirror.current = instantiateCodeMirror({ editor: editorRef.current!, note: props.note! });
    const changeListener = highlightTagsInEditor({ editorView: codeMirror.current!, store, synonymIds: props.synonymIds });
    return () => {
      codeMirror.current?.destroy();
      changeListener.unsubscribe();
    }
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
      syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
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

