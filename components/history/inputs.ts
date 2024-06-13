import { useLocalStore, useStore } from "@/utils/store-utils";
import { formatDistanceToNow } from "date-fns";
import { useMemo, useRef } from "react";
import { CardHandle } from "../card/constants";
import { initialState, pageSize } from "./constants";


export const useInputs = () => {

  const { store, state: { activeNoteId }, derivations: { notesSorted } } = useStore();
  const { local, state: { index } } = useLocalStore('historyItems', initialState);

  const cardRef = useRef<CardHandle>(null);

  const items = useMemo(() => {
    return notesSorted
      .filter(note => activeNoteId !== note.id)
      .slice(0, (index + 1) * pageSize)
      .map(note => ({
        ...note,
        date: formatDistanceToNow(note.dateUpdated!, { addSuffix: true }),
      }));
  }, [activeNoteId, index, notesSorted]);

  return {
    store,
    local,
    ...local.$state,
    items,
    cardRef,
  };
}
