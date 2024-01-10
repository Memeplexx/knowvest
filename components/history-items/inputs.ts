import { HistoryItemsStore, Props, initialState, pageSize, tag } from "./constants";
import { formatDistanceToNow } from "date-fns";
import { useImperativeHandle, useMemo } from "react";
import { useActiveNotesSortedByDateViewed, useNestedStore } from "@/utils/hooks";

export const useInputs = (
  props: Props,
) => {

  const { store, state } = useNestedStore(tag, initialState);

  const notes = useNotesSortedAndSliced(store);

  useImperativeHandle(props.innerRef, () => ({
    onScrollToBottom: () => store.historyItems.index.$add(1),
  }), [store]);

  return {
    props,
    store,
    notes,
    ...state,
  };
}

const useNotesSortedAndSliced = (store: HistoryItemsStore) => {
  const notesSorted = useActiveNotesSortedByDateViewed(store);
  const activeNoteId = store.activeNoteId.$useState();
  const index = store.historyItems.index.$useState();
  return useMemo(() => {
    return notesSorted
      .filter(note => activeNoteId !== note.id)
      .slice(0, (index + 1) * pageSize)
      .map(note => ({
        ...note,
        date: formatDistanceToNow(note.dateViewed!, { addSuffix: true }),
      }));
  }, [activeNoteId, index, notesSorted]);
}
