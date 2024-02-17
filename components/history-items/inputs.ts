import { Props, initialState, pageSize } from "./constants";
import { formatDistanceToNow } from "date-fns";
import { useImperativeHandle, useMemo } from "react";
import {  useStore } from "@/utils/hooks";

export const useInputs = (
  props: Props,
) => {

  const { store, historyItems, activeNoteId, notes } = useStore(initialState);

  const items = useMemo(() => {
    return notes
      .filter(note => activeNoteId !== note.id)
      .filter(note => !note.isArchived)
      .sort((a, b) => b.dateViewed!.getTime() - a.dateViewed!.getTime())
      .slice(0, (historyItems.index + 1) * pageSize)
      .map(note => ({
        ...note,
        date: formatDistanceToNow(note.dateViewed!, { addSuffix: true }),
      }));
  }, [activeNoteId, historyItems.index, notes]);

  useImperativeHandle(props.innerRef, () => ({
    onScrollToBottom: function onScrollToBottom(){ store.historyItems.index.$add(1); },
  }), [store]);

  return {
    props,
    store,
    items,
    ...historyItems,
  };
}
