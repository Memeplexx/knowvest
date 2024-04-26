import { NoteTagDTO, SynonymGroupDTO, SynonymId, TagDTO, TagId } from "@/actions/types";
import { EditorView } from "codemirror";
import { DeepReadonlyArray, Store } from "olik";
import { ReviseEditorTagsArgs } from "./codemirror-utils";
import { AppState } from "./store-utils";


export type tagType = 'primary' | 'secondary';

const cache = {
  key: {
    synonymGroups: [] as ReadonlyArray<SynonymGroupDTO>,
    synonymIds: [] as ReadonlyArray<SynonymId>,
    tags: [] as ReadonlyArray<TagDTO>,
    noteTags: [] as ReadonlyArray<NoteTagDTO>,
  },
  value: [] as DeepReadonlyArray<(NoteTagDTO & { type: tagType })>,
};
const getDataViaCache = (store: Store<AppState>) => {
  const { synonymGroups, synonymIds, tags, noteTags } = store.$state;
  if (Object.keysTyped(cache.key).every(k => cache.key[k] === store.$state[k])) return cache.value;
  const groupSynonymIds = synonymGroups
    .filter(sg => synonymIds.includes(sg.synonymId))
    .distinct();
  cache.key = { synonymGroups, synonymIds, tags, noteTags };
  const primary = [...synonymIds, ...groupSynonymIds]
    .flatMap(synonymId => tags.filter(t => t.synonymId === synonymId))
    .distinct(t => t.id)
    .flatMap(t => noteTags.filter(nt => nt.tagId === t.id));
  const primaryNoteTagIds = primary.map(nt => nt.id).distinct();
  const secondary = noteTags
    .filter(nt => !primaryNoteTagIds.includes(nt.id));
  cache.value = [
    ...primary.map(nt => ({ ...nt, type: 'primary' as const })),
    ...secondary.map(nt => ({ ...nt, type: 'secondary' as const }))
  ];
  return cache.value;
}

export const listenToTagsForEditor = <S extends AppState>({
  editorView,
  store,
  reviseEditorTags
}: {
  editorView: EditorView,
  store: Store<S>,
  reviseEditorTags: (arg: ReviseEditorTagsArgs) => void
}) => {

  let previousTagPositions = new Array<{ from: number; to: number; tagId: TagId, type: tagType }>();

  const onChangeNoteTags = (noteTags: DeepReadonlyArray<(NoteTagDTO & { type: tagType })>) => {
    const docString = editorView.state.doc.toString() || '';
    const removeTags = previousTagPositions
      .distinct(t => t.tagId + ' ' + t.from)
      .map(t => ({
        ...t,
        // if user deletes last character and char is inside tag, we will get an out of bounds error. This prevents that
        to: Math.min(t.to, editorView.state.doc.length || Number.MAX_VALUE)
      }));
    const addTags = noteTags
      .map(nt => {
        const tag = store.tags.$state.find(t => t.id === nt.tagId);
        return tag ? { ...tag, type: nt.type } : null;
      })
      .filterTruthy()
      .flatMap(tag => [...docString.matchAll(new RegExp(`\\b(${tag.text})\\b`, 'ig'))]
        .map(m => m.index!)
        .map(index => ({ from: index, to: index + tag.text.length, tagId: tag.id, type: tag.type })))
      .distinct(t => t.tagId + ' ' + t.from);
    reviseEditorTags({ addTags, removeTags, editorView });
    previousTagPositions = addTags;
  }

  const subscriptions = [store.writingNote, store.writingNoteTags, store.synonymIds, store.tags, store.noteTags, store.synonymGroups]
    .map(item => item.$onChange(() => {
      if (store.$state.writingNote || store.$state.writingNoteTags) return;
      onChangeNoteTags(getDataViaCache(store));
    }));
  onChangeNoteTags(getDataViaCache(store));
  return { unsubscribe: () => subscriptions.forEach(sub => sub.unsubscribe()) };
}
