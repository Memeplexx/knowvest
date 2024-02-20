import { useStore } from "@/utils/store-utils";
import { formatDistanceToNow } from "date-fns";
import { useImperativeHandle, useMemo, useRef } from "react";
import { HistoryItemsHandle, Props, initialState, pageSize } from "./constants";
import { CardHandle } from "../card/constants";

export const useInputs = (
  props: Props,
) => {

  const { store, historyItems, activeNoteId, notes, stateInitialized } = useStore(initialState);

  const listItemsRef = useRef<HistoryItemsHandle>(null);
  const cardRef = useRef<CardHandle>(null);

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
    stateInitialized,
    ...historyItems,
    cardRef,
    listItemsRef
  };
}
