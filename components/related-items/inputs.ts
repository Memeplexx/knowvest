import { useStore } from "@/utils/hooks";
import { Props } from "./constants";
import { useMemo } from "react";

export const useInputs = (props: Props) => {

  const { store, notes, tags, noteTags, synonymIds, activeNoteId, stateInitialized } = useStore();

  const items = useMemo(() => {
    const unArchivedNotes = notes.filter(n => !n.isArchived);
    const unArchivedTags = tags.filter(t => !t.isArchived);
    const unArchivedNoteTags = noteTags.filter(nt => !nt.isArchived);
    return synonymIds
      .flatMap(synonymId => unArchivedTags.filter(t => t.synonymId === synonymId))
      .map(t => t.id)
      .distinct()
      .flatMap(tagId => unArchivedNoteTags.filter(nt => nt.noteId !== activeNoteId && nt.tagId === tagId))
      .groupBy(n => n.noteId)
      .map(n => ({
        note: unArchivedNotes.findOrThrow(nn => nn.id === n[0].noteId),
        count: n.length,
      }))
      .sort((a, b) => b.count - a.count)
      .map(n => ({
        ...n,
        matches: `${n.count} match${n.count === 1 ? '' : 'es'}`,
      }));
  }, [activeNoteId, notes, tags, noteTags, synonymIds]);

  return {
    props,
    store,
    items,
    stateInitialized,
  }

};