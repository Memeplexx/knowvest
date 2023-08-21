import { derive } from "olik";
import { Props } from "./constants";
import { useContext } from "react";
import { OlikContext } from "@/utils/pages/home/constants";

export const useHooks = (props: Props) => {

  const appStore = useContext(OlikContext)!;

  const queriedNotes = derive(
    appStore.activeNoteId,
    appStore.notes,
    appStore.tags,
    appStore.noteTags,
    appStore.synonymIds,
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
      .sort((a, b) => b.count - a.count);
  });

  return {
    ...props,
    appStore,
    queriedNotes: queriedNotes.$useState(),
  }

};