import { oneDark } from '@/utils/codemirror-theme';
import { bulletPointPlugin, inlineNotePlugin, noteBlockPlugin, reviseEditorTags, titleFormatPlugin } from '@/utils/codemirror-utils';
import { useComponent } from '@/utils/react-utils';
import { store } from '@/utils/store-utils';
import { markdown } from '@codemirror/lang-markdown';
import { defaultHighlightStyle, syntaxHighlighting } from '@codemirror/language';
import { languages as codeLanguages } from '@codemirror/language-data';
import { EditorState } from '@codemirror/state';
import { EditorView } from '@codemirror/view';
import { Highlighter } from '@lezer/highlight';
import { useRef } from 'react';
import { Props } from './constants';


export const useInputs = (props: Props) => {

  const editorRef = useRef<HTMLDivElement>(null);
  const component = useComponent();
  const result = { editorRef, editor: null as EditorView | null };

  // Do not instantiate the editor until certain conditions are met
  if (!component.isMounted)
    return result;
  if (component.hasCompletedAsyncProcess)
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
  const doRemoveEditorTags = () => reviseEditorTags({
    codeMirror: editor,
    noteId: props.note!.id,
    synonymIds: props.synonymIds.$state,
    groupSynonymIds: props.groupSynonymIds?.$state,
    searchResults: props.searchResults?.$state,
  });
  component.listen = store.searchResults.$find.noteId.$eq(props.note!.id).$onChange(doRemoveEditorTags);
  component.listen = props.synonymIds.$onChange(doRemoveEditorTags);
  component.listen = props.groupSynonymIds?.$onChange(doRemoveEditorTags);
  component.listen = store.synonymGroups.$onChange(doRemoveEditorTags);
  component.listen = store.tags.$onChange(doRemoveEditorTags);
  component.listen = props.searchResults?.$onChange(doRemoveEditorTags);
  doRemoveEditorTags();
  component.completeAsyncProcess();
  return result;
}
