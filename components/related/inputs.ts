import { derive } from "olik/derive";
import { Props, tag } from "./constants";
import { useContext, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { CardHandle } from "../card/constants";
import { StoreContext } from "@/utils/constants";
import { useIsMounted } from "@/utils/hooks";

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

  const isMounted = useIsMounted();
  const [loading, setLoading] = useState(true);
  const RelatedNotes = useMemo(() => {
    if (!isMounted) { return null; }
    return dynamic(() => import('../related-items').finally(() => setLoading(false)));
  }, [isMounted]);

  return {
    props,
    store,
    cardRef: useRef<CardHandle>(null),
    loading,
    noteCountString: noteCountString.$useState(),
    RelatedNotes,
  }

};