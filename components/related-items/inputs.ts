import { derive } from "olik/derive";
import { Props } from "./constants";
import { useContext } from "react";
import { StoreContext } from "@/utils/constants";

export const useInputs = (props: Props) => {

  const store = useContext(StoreContext)!;

  const items = derive(
    store.activeNoteId,
    store.notes,
    store.tags,
    store.noteTags,
    store.synonymIds,
  ).$with((activeNoteId, notes, tags, noteTags, synonymIds) => {
    return synonymIds
      .flatMap(synonymId => tags.filter(t => t.synonymId === synonymId))
      .map(t => t.id)
      .distinct()
      .flatMap(tagId => noteTags.filter(nt => nt.noteId !== activeNoteId && nt.tagId === tagId))
      .groupBy(n => n.noteId)
      .map(n => ({
        note: notes.findOrThrow(nn => nn.id === n[0].noteId),
        count: n.length,
      }))
      .sort((a, b) => b.count - a.count)
      .map(n => ({
        ...n,
        matches: `${n.count} match${n.count === 1 ? '' : 'es'}`,
      }));
  }).$useState();

  return {
    props,
    store,
    items,
  }

};