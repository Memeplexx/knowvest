import { useLocalStore, useStore } from "@/utils/store-utils";
import { useMemo, useRef } from "react";
import { CardHandle } from "../card/constants";
import { initialState, pageSize } from "./constants";

export const useInputs = () => {

  const { store, state: { notes, synonymIds, activeNoteId, noteTags } } = useStore();
  const { local, state: { index } } = useLocalStore('relatedItems', initialState);

  const cardRef = useRef<CardHandle>(null);

  const items = useMemo(() => {
    return Object.entries(noteTags)
      .filter(([noteId]) => +noteId !== activeNoteId)
      .map(([noteId, tags]) => ({
        noteId,
        count: tags.filter(t => synonymIds.includes(t.synonymId!)).length,
      }))
      .filter(({ count }) => count > 0)
      .sort((a, b) => b.count - a.count)
      .slice(0, (index + 1) * pageSize)
      .map(({ noteId, count }) => ({
        note: notes.findOrThrow(n => n.id === +noteId),
        count,
        matches: `${count} match${count === 1 ? '' : 'es'}`,
      }));
  }, [activeNoteId, index, notes, synonymIds, noteTags]);

  const noteCountString = useMemo(() => {
    return `${items.length} result${items.length === 1 ? '' : 's'}`;
  }, [items]);

  return {
    store,
    local,
    items,
    noteCountString,
    cardRef,
  }

};