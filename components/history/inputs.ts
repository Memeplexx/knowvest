import { useDerivations, useLocalStore, useStore } from "@/utils/store-utils";
import { formatDistanceToNow } from "date-fns";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { initialState, pageSize } from "./constants";


export const useInputs = () => {

  const { store, state: { activeNoteId } } = useStore();
  const { notesSorted } = useDerivations();
  const { local, state: { index } } = useLocalStore('historyItems', initialState);
  const router = useRouter();

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
    router,
  };
}
