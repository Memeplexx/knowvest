import { NoteDTO } from '@/server/dtos';
import { useAddAriaAttributeToCodeMirror, useIsomorphicLayoutEffect, useNoteTagsToTagHighlighter } from '@/utils/hooks';
import { markdown } from '@codemirror/lang-markdown';
import { defaultHighlightStyle, syntaxHighlighting } from '@codemirror/language';
import { languages } from '@codemirror/language-data';
import { EditorState } from '@codemirror/state';
import { EditorView } from '@codemirror/view';
import { type RefObject, useRef, useState } from 'react';
import { Props } from './constants';


export const useInputs = (props: Props) => {

  const editorDomElement = useRef<HTMLDivElement>(null);

  const codeMirror = useCodeMirror(editorDomElement, props.note);

  useNoteTagsToTagHighlighter(codeMirror, props.synonymIds);

  useAddAriaAttributeToCodeMirror({ noteId: props.note.id, editorDomElement });

  return {
    refs: { editor: editorDomElement },
    props,
  }
}

const useCodeMirror = (
  editorDomElement: RefObject<HTMLDivElement>,
  note: NoteDTO,
) => {
  const editorRef = useRef<EditorView | null>(null);
  const [, setNum] = useState(0);
  useIsomorphicLayoutEffect(() => {
    if (!editorDomElement.current) { return; }
    if (editorRef.current) {
      editorRef.current.destroy();
      setNum(n => n + 1);
    }
    editorRef.current = new EditorView({
      doc: note.text,
      parent: editorDomElement.current!,
      extensions: [
        syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
        markdown({ codeLanguages: languages }),
        EditorState.readOnly.of(true),
        EditorView.lineWrapping,
      ],
    });
  }, [editorDomElement, note]);
  return editorRef.current;
}


