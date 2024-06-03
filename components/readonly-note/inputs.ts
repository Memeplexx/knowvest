import { oneDark } from '@/utils/codemirror-theme';
import { bulletPointPlugin, doReviseTagsInEditor, inlineNotePlugin, noteBlockPlugin, tagType, titleFormatPlugin } from '@/utils/codemirror-utils';
import { useComponent } from '@/utils/react-utils';
import { useStore } from '@/utils/store-utils';
import { markdown } from '@codemirror/lang-markdown';
import { defaultHighlightStyle, syntaxHighlighting } from '@codemirror/language';
import { languages as codeLanguages } from '@codemirror/language-data';
import { EditorState } from '@codemirror/state';
import { EditorView } from '@codemirror/view';
import { Highlighter } from '@lezer/highlight';
import { useRef } from 'react';
import { TagResult } from '../../utils/tags-worker';
import { Props } from './constants';


export const useInputs = (props: Props) => {

  const { store } = useStore();
  const editorRef = useRef<HTMLDivElement>(null);
  const component = useComponent();
  const result = { editorRef, editor: null as EditorView | null };

  // Do not instantiate the editor until certain conditions are met
  if (!component.isMounted)
    return result;
  if (props.if === false)
    return result;
  if (!component.isPristine)
    return result;

  // Instantiate the editor
  component.start();
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
  const latestTagsFromWorker = new Array<TagResult & { type?: tagType }>();
  const previousPositions = new Array<TagResult & { type?: tagType }>();
  component.listen = store.tagNotes[props.note!.id]!.$onChangeImmediate(current => {
    latestTagsFromWorker.length = 0;
    latestTagsFromWorker.push(...current);
    doReviseTagsInEditor(store, editor, latestTagsFromWorker, previousPositions);
    previousPositions.length = 0;
    previousPositions.push(...current);
  });
  const reviseTagsInEditor = () => doReviseTagsInEditor(store, editor, latestTagsFromWorker, previousPositions);
  component.listen = store.synonymIds.$onChangeImmediate(reviseTagsInEditor);
  component.listen = store.synonymGroups.$onChange(reviseTagsInEditor);
  component.listen = store.tags.$onChange(reviseTagsInEditor);
  component.done();
  return {
    ...result,
    editor
  };
}
