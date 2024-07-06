import { useStore } from "@/utils/store-utils";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { pageSize } from "./constants";

export const useInputs = () => {

  const { notes, synonymIds, activeNoteId, searchResults, relatedNotesScrollIndex } = useStore();
  const router = useRouter();

  const items = useMemo(() => {
    return searchResults
      .filter(r => r.noteId !== activeNoteId)
      .groupBy(r => r.noteId)
      .map(group => ({
        noteId: group[0]!.noteId,
        count: group.filter(nt => synonymIds.includes(nt.synonymId!)).length,
      }))
      .filter(e => e.count > 0)
      .sort((a, b) => b.count - a.count)
      .slice(0, (relatedNotesScrollIndex + 1) * pageSize)
      .map(e => ({
        note: notes.find(n => n.id === e.noteId)!,
        count: e.count,
        matches: `${e.count} match${e.count === 1 ? '' : 'es'}`,
      }))
      .filter(e => !!e.note); // note may not be found when note is deleted
  }, [activeNoteId, relatedNotesScrollIndex, notes, synonymIds, searchResults]);

  return {
    items,
    router,
  }

};