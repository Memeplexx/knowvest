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
      .sort((a, b) => b.count - a.count)
      .map(n => ({
        ...n,
        matches: `${n.count} match${n.count === 1 ? '' : 'es'}`,
      }));
  });

  const noteCountString = derive(
    queriedNotes
  ).$with((queriedNotes) => {
    return `${queriedNotes.length} result${queriedNotes.length === 1 ? '' : 's'}`;
  })

  return {
    ...props,
    appStore,
    queriedNotes: queriedNotes.$useState(),
    noteCountString: noteCountString.$useState(),
  }

};