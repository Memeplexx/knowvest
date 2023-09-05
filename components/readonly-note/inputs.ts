import { NoteDTO } from '@/server/dtos';
import { addAriaAttributeToCodeMirror, createBulletPointPlugin, createNoteBlockPlugin, highlightTagsInEditor } from '@/utils/functions';
import { useIsomorphicLayoutEffect } from '@/utils/hooks';
import { markdown } from '@codemirror/lang-markdown';
import { defaultHighlightStyle, syntaxHighlighting } from '@codemirror/language';
import { languages } from '@codemirror/language-data';
import { EditorState } from '@codemirror/state';
import { EditorView } from '@codemirror/view';
import { useRef } from 'react';
import { Props } from './constants';


export const useInputs = (props: Props) => {

  const editorDomElement = useRef<HTMLDivElement>(null);

  const codeMirror = useRef<EditorView | null>(null);

  useIsomorphicLayoutEffect(() => {
    if (codeMirror.current) { return; /* defend against re-render when React strictMode is set to true */ }
    codeMirror.current = instantiateCodeMirror({ editor: editorDomElement.current!, note: props.note });
    highlightTagsInEditor({ editorView: codeMirror.current!, synonymIds: props.synonymIds });
    addAriaAttributeToCodeMirror({ editor: editorDomElement.current!, noteId: props.note.id });
  }, []);

  return {
    refs: { editor: editorDomElement },
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
      createBulletPointPlugin(),
      createNoteBlockPlugin(),
    ],
  });
}

