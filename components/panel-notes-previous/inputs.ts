import { useDerivations, useLocalStore, useStore } from "@/utils/store-utils";
import { formatDistanceToNow } from "date-fns";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { pageSize } from "./constants";


export const useInputs = () => {

  const { activeNoteId } = useStore();
  const { notesSorted } = useDerivations();
  const { local, state } = useLocalStore('historyItems', { index: 0 });
  const { index } = state;
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
    local,
    items,
    router,
    ...state,
  };
}
