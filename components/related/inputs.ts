import { StoreContext } from "@/utils/constants";
import { useComponentDownloader } from "@/utils/hooks";
import { derive } from "olik/derive";
import { useContext, useRef } from "react";
import { CardHandle } from "../card/constants";
import { Props, tag } from "./constants";

export const useInputs = (props: Props) => {

  const store = useContext(StoreContext)!;

  const queriedNotes = derive(tag).$from(
    store.activeNoteId,
    store.notes,
    store.tags,
    store.noteTags,
    store.synonymIds,
  ).$with((activeNoteId, notes, tags, noteTags, synonymIds) => {
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
  });

  const noteCountString = derive(tag).$from(
    queriedNotes
  ).$with((queriedNotes) => {
    return `${queriedNotes.length} result${queriedNotes.length === 1 ? '' : 's'}`;
  })

  const listItems = useComponentDownloader(() => import('../related-items').then(m => m.RelatedItems));

  return {
    props,
    store,
    cardRef: useRef<CardHandle>(null),
    listItems,
    noteCountString: noteCountString.$useState(),
  }

};