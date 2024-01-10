import { Props } from "./constants";
import { useContext, useMemo } from "react";
import { StoreContext } from "@/utils/constants";

export const useInputs = (props: Props) => {

  const store = useContext(StoreContext)!;
  const notes = store.notes.$useState();
  const tags = store.tags.$useState();
  const noteTags = store.noteTags.$useState();
  const synonymIds = store.synonymIds.$useState();
  const activeNoteId = store.activeNoteId.$useState();

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
  }

};