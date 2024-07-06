import { useDerivations, useStore } from "@/utils/store-utils";
import { formatDistanceToNow } from "date-fns";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { pageSize } from "./constants";


export const useInputs = () => {

  const { activeNoteId, previousNotesScrollIndex } = useStore();
  const { notesSorted } = useDerivations();
  const router = useRouter();

  const items = useMemo(() => {
    return notesSorted
      .filter(note => activeNoteId !== note.id)
      .slice(0, (previousNotesScrollIndex + 1) * pageSize)
      .map(note => ({
        ...note,
        date: formatDistanceToNow(note.dateUpdated!, { addSuffix: true }),
      }));
  }, [activeNoteId, previousNotesScrollIndex, notesSorted]);

  return {
    items,
    router,
  };
}
