"use client";

import { useComponentDownloader, useStore } from "@/utils/hooks";
import { useMemo, useRef } from "react";
import { CardHandle } from "../card/constants";
import { Props } from "./constants";

export const useInputs = (props: Props) => {

  const { store, activeNoteId, notes, tags, noteTags, synonymIds } = useStore();

  const cardRef = useRef<CardHandle>(null);

  const queriedNotes = useMemo(() => {
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
    return `${queriedNotes.length} result${queriedNotes.length === 1 ? '' : 's'}`;
  }, [queriedNotes]);

  const RelatedItems = useComponentDownloader(() => import('../related-items'));

  return {
    props,
    store,
    cardRef,
    RelatedItems,
    noteCountString,
  }

};