import { useStore } from "@/utils/store-utils";
import { useMemo, useRef } from "react";
import { Props } from "./constants";
import { CardHandle } from "../card/constants";

export const useInputs = (props: Props) => {

  const { store, notes, tags, noteTags, synonymIds, activeNoteId, stateInitialized } = useStore();

  const cardRef = useRef<CardHandle>(null);

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
      .filter(noteTagGroup => !noteTagGroup[0].isArchived)
      .map(noteTagGroup => ({
        note: unArchivedNotes.findOrThrow(note => note.id === noteTagGroup[0].noteId),
        count: noteTagGroup.filter(noteTag => !noteTag.isArchived).length,
      }))
      .sort((a, b) => b.count - a.count)
      .map(n => ({
        ...n,
        matches: `${n.count} match${n.count === 1 ? '' : 'es'}`,
      }));
  }, [activeNoteId, notes, tags, noteTags, synonymIds]);

  const noteCountString = useMemo(() => {
    return `${items.length} result${items.length === 1 ? '' : 's'}`;
  }, [items]);

  return {
    props,
    store,
    items,
    stateInitialized,
    noteCountString,
    cardRef,
  }

};