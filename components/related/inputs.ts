import { useLocalStore, useStore } from "@/utils/store-utils";
import { useMemo, useRef } from "react";
import { CardHandle } from "../card/constants";
import { initialState, pageSize } from "./constants";

export const useInputs = () => {

  const { store, state: { notes, synonymIds, activeNoteId, noteTags } } = useStore();
  const { local, state: { index } } = useLocalStore('relatedItems', initialState);

  const cardRef = useRef<CardHandle>(null);

  const items = useMemo(() => {
    return noteTags
      .filter(nt => nt.noteId !== activeNoteId)
      .groupBy(nt => nt.noteId)
      .map(group => ({
        noteId: group[0]!.noteId,
        count: group.filter(nt => synonymIds.includes(nt.synonymId!)).length,
      }))
      .filter(e => e.count > 0)
      .sort((a, b) => b.count - a.count)
      .slice(0, (index + 1) * pageSize)
      .map(e => ({
        note: notes.find(n => n.id === e.noteId)!,
        count: e.count,
        matches: `${e.count} match${e.count === 1 ? '' : 'es'}`,
      }))
      .filter(e => !!e.note); // note may not be found when note is deleted
  }, [activeNoteId, index, notes, synonymIds, noteTags]);

  return {
    store,
    local,
    items,
    cardRef,
  }

};