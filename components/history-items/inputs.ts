import { Props, initialState, pageSize } from "./constants";
import { formatDistanceToNow } from "date-fns";
import { useImperativeHandle, useMemo } from "react";
import { useActiveNotesSortedByDateViewed, useStore } from "@/utils/hooks";

export const useInputs = (
  props: Props,
) => {

  const { store, historyItems, activeNoteId } = useStore(initialState);
  const notesSorted = useActiveNotesSortedByDateViewed(store);

  const notes = useMemo(() => {
    return notesSorted
      .filter(note => activeNoteId !== note.id)
      .slice(0, (historyItems.index + 1) * pageSize)
      .map(note => ({
        ...note,
        date: formatDistanceToNow(note.dateViewed!, { addSuffix: true }),
      }));
  }, [activeNoteId, historyItems.index, notesSorted]);

  useImperativeHandle(props.innerRef, () => ({
    onScrollToBottom: () => store.historyItems.index.$add(1),
  }), [store]);

  return {
    props,
    store,
    notes,
    ...historyItems,
  };
}
