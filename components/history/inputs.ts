import { useLocalStore, useStore } from "@/utils/store-utils";
import { formatDistanceToNow } from "date-fns";
import { useMemo, useRef } from "react";
import { CardHandle } from "../card/constants";
import { initialState, pageSize } from "./constants";

export const useInputs = () => {

  const { store, state: { activeNoteId, notes } } = useStore();
  const { local, state: { index } } = useLocalStore('historyItems', initialState);

  const cardRef = useRef<CardHandle>(null);

  const items = useMemo(() => {
    return notes
      .filter(note => activeNoteId !== note.id)
      .sort((a, b) => b.dateUpdated.getTime() - a.dateUpdated.getTime())
      .slice(0, (index + 1) * pageSize)
      .map(note => ({
        ...note,
        date: formatDistanceToNow(note.dateUpdated!, { addSuffix: true }),
      }));
  }, [activeNoteId, index, notes]);

  return {
    store,
    local,
    ...local.$state,
    items,
    cardRef,
  };
}
