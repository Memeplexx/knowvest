import { oneDark } from '@/utils/codemirror-theme';
import { bulletPointPlugin, doReviseTagsInEditor, inlineNotePlugin, noteBlockPlugin, tagType, titleFormatPlugin } from '@/utils/codemirror-utils';
import { useIsMounted, useIsomorphicLayoutEffect } from '@/utils/react-utils';
import { useStore } from '@/utils/store-utils';
import { useTagsContext } from '@/utils/tags-provider';
import { markdown } from '@codemirror/lang-markdown';
import { defaultHighlightStyle, syntaxHighlighting } from '@codemirror/language';
import { languages } from '@codemirror/language-data';
import { EditorState } from '@codemirror/state';
import { EditorView } from '@codemirror/view';
import { Highlighter } from '@lezer/highlight';
import { useRef } from 'react';
import { TagSummary } from '../../utils/tags-worker';
import { Props } from './constants';


export const useInputs = (props: Props) => {

  const { store } = useStore();

  const editorRef = useRef<HTMLDivElement>(null);
  const codeMirror = useRef<EditorView | null>(null);

  const isMounted = useIsMounted();
  const tagsWorker = useTagsContext();

  useIsomorphicLayoutEffect(() => {
    if (!isMounted) return;
    if (!tagsWorker) return;
    if (props.if === false) return;
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

    tagsWorker.updateNote(props.note!);

    const latestTagsFromWorker = new Array<TagSummary>();
    const unsubscribeFromWorker = tagsWorker.addListener(async event => {
      if (event.data.noteId !== props.note!.id) return;
      latestTagsFromWorker.length = 0;
      latestTagsFromWorker.push(...event.data.tags);
      reviseTagsInEditor();
    });

    const previousPositions = new Array<{ from: number, to: number, type: tagType }>();
    const reviseTagsInEditor = () => doReviseTagsInEditor(store, codeMirror.current!, latestTagsFromWorker, previousPositions);
    const unsubscribeFromSynonymIds = store.synonymIds.$onChangeImmediate(reviseTagsInEditor);
    const unsubscribeFromSynonymGroupsChange = store.synonymGroups.$onChange(reviseTagsInEditor);
    reviseTagsInEditor();

    return () => {
      unsubscribeFromWorker();
      unsubscribeFromSynonymIds();
      unsubscribeFromSynonymGroupsChange();
      codeMirror.current?.destroy();
      tagsWorker.removeNote(props.note!.id);
    }
  }, [props.if, isMounted, tagsWorker, props.note, store]);

  return {
    editorRef,
  }
}
