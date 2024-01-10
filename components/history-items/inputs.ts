import { Props, initialState, pageSize } from "./constants";
import { formatDistanceToNow } from "date-fns";
import { useImperativeHandle, useMemo } from "react";
import { useActiveNotesSortedByDateViewed, useNestedStore } from "@/utils/hooks";

export const useInputs = (
  props: Props,
) => {

  const { store, state } = useNestedStore('historyItems', initialState);
  const notesSorted = useActiveNotesSortedByDateViewed(store);
  const activeNoteId = store.activeNoteId.$useState();

  const notes = useMemo(() => {
    return notesSorted
      .filter(note => activeNoteId !== note.id)
      .slice(0, (state.index + 1) * pageSize)
      .map(note => ({
        ...note,
        date: formatDistanceToNow(note.dateViewed!, { addSuffix: true }),
      }));
  }, [activeNoteId, state.index, notesSorted]);

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
