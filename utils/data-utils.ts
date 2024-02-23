import { NoteTagDTO, SynonymGroupDTO, SynonymId, TagDTO, TagId } from "@/actions/types";
import { EditorView } from "codemirror";
import { Store } from "olik";
import { AppState } from "./store-utils";
import { ReviseEditorTagsArgs } from "./codemirror-utils";


const cache = {
  key: {
    synonymGroups: new Array<SynonymGroupDTO>(),
    synonymIds: new Array<SynonymId>(),
    tags: new Array<TagDTO>(),
    noteTags: new Array<NoteTagDTO>(),
  },
  value: new Array<NoteTagDTO>
};
const getDataViaCache = (store: Store<AppState>) => {
  const { synonymGroups, synonymIds, tags, noteTags } = store.$state;
  if ((Object.keys(cache.key) as Array<keyof typeof cache.key>).every(k => cache.key[k] === store.$state[k])) { return cache.value; }
  const groupSynonymIds = synonymGroups
    .filter(sg => synonymIds.includes(sg.synonymId))
    .distinct();
  cache.key = { synonymGroups, synonymIds, tags, noteTags };
  cache.value = [...synonymIds, ...groupSynonymIds]
    .flatMap(synonymId => tags.filter(t => t.synonymId === synonymId))
    .distinct(t => t.id)
    .flatMap(t => noteTags.filter(nt => nt.tagId === t.id));
  return cache.value;
}

export const listenToTagsForEditor = ({ editorView, store, onChange }: { editorView: EditorView, store: Store<AppState>, onChange: (arg: ReviseEditorTagsArgs) => void }) => {

  let previousTagPositions = new Array<{ from: number; to: number; tagId: TagId }>();

  const onChangeNoteTags = (noteTags: NoteTagDTO[]) => {
    const docString = editorView.state.doc.toString() || '';
    const tagPositions = noteTags
      .map(nt => store.tags.$state.find(t => t.id === nt.tagId))
      .filterTruthy()
      .flatMap(tag => [...docString.matchAll(new RegExp(`\\b(${tag.text})\\b`, 'ig'))]
        .map(m => m.index!)
        .map(index => ({ from: index, to: index + tag.text.length, tagId: tag.id })))
      .distinct(t => t.tagId + ' ' + t.from);

    const removeTags = previousTagPositions
      .filter(tp => !tagPositions.some(t => t.tagId === tp.tagId && t.from === tp.from && t.to === tp.to))
      .distinct(t => t.tagId + ' ' + t.from)
      .map(t => ({
        ...t,
        // if user deletes last character and char is inside tag, we will get an out of bounds error. This prevents that
        to: Math.min(t.to, editorView.state.doc.length || Number.MAX_VALUE)
      }));
    const addTags = tagPositions
      .filter(tp => !previousTagPositions.some(t => t.tagId === tp.tagId && t.from === tp.from && t.to === tp.to))
      .distinct(t => t.tagId + ' ' + t.from);

    onChange({ addTags, removeTags, editorView });
    previousTagPositions = tagPositions;
  }

  const subscriptions = [store.synonymIds, store.tags, store.noteTags, store.synonymGroups]
    .map(item => item.$onChange(() => onChangeNoteTags(getDataViaCache(store))));
  onChangeNoteTags(getDataViaCache(store));
  return { unsubscribe: () => subscriptions.forEach(sub => sub.unsubscribe()) };
}
