import { oneDark } from '@/utils/codemirror-theme';
import { bulletPointPlugin, doReviseTagsInEditor, inlineNotePlugin, noteBlockPlugin, tagType, titleFormatPlugin } from '@/utils/codemirror-utils';
import { useIsMounted, useIsomorphicLayoutEffect } from '@/utils/react-utils';
import { useStore } from '@/utils/store-utils';
import { useTagsContext } from '@/utils/tags-provider';
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
  const codeMirror = useRef<EditorView | null>(null);

  const isMounted = useIsMounted();
  const tagsWorker = useTagsContext();

  useIsomorphicLayoutEffect(() => {

    // Do not instantiate the editor until certain conditions are met
    if (!isMounted) return;
    if (!tagsWorker) return;
    if (props.if === false) return;

    // Instantiate the editor
    codeMirror.current = new EditorView({
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

    // Register note in listener
    tagsWorker.updateNote(props.note!);

    // Listen to changes in this note as well as its text, and notify the worker as required
    const latestTagsFromWorker = new Array<TagResult & { type?: tagType }>();
    const unsubscribeFromWorker = tagsWorker.addListener(async event => {
      if (event.data.noteId !== props.note!.id) return;
      latestTagsFromWorker.length = 0;
      latestTagsFromWorker.push(...event.data.tags);
      reviseTagsInEditor();
    });

    // Listen to changes in tags and synonyms, and notify the worker as required
    const previousPositions = new Array<TagResult & { type?: tagType }>();
    const reviseTagsInEditor = () => doReviseTagsInEditor(store, codeMirror.current!, latestTagsFromWorker, previousPositions);
    const unsubscribeFromSynonymIdsChange = store.synonymIds.$onChangeImmediate(reviseTagsInEditor);
    const unsubscribeFromSynonymGroupsChange = store.synonymGroups.$onChange(reviseTagsInEditor);
    const unsubscribeFromTagsChange = store.tags.$onChange(reviseTagsInEditor);

    // Cleanup
    return () => {
      unsubscribeFromTagsChange();
      unsubscribeFromWorker();
      unsubscribeFromSynonymIdsChange();
      unsubscribeFromSynonymGroupsChange();
      codeMirror.current?.destroy();
      tagsWorker.removeNote(props.note!.id);
    }
  }, [props.if, isMounted, tagsWorker, props.note, store]);

  return {
    editorRef,
  }
}
