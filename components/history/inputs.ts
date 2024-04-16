import { useStore } from "@/utils/store-utils";
import { formatDistanceToNow } from "date-fns";
import { useMemo, useRef } from "react";
import { initialState, pageSize } from "./constants";
import { CardHandle } from "../card/constants";

export const useInputs = () => {

  const { store, historyItems, activeNoteId, notes, stateInitialized } = useStore(initialState);

  const cardRef = useRef<CardHandle>(null);

  const items = useMemo(() => {
    return notes
      .filter(note => activeNoteId !== note.id)
      .sort((a, b) => b.dateViewed!.getTime() - a.dateViewed!.getTime())
      .slice(0, (historyItems.index + 1) * pageSize)
      .map(note => ({
        ...note,
        date: formatDistanceToNow(note.dateViewed!, { addSuffix: true }),
      }));
  }, [activeNoteId, historyItems.index, notes]);

  return {
    store,
    items,
    stateInitialized,
    ...historyItems,
    cardRef,
  };
}
