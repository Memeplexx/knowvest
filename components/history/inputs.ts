import { useComponentDownloader, useStore } from "@/utils/hooks";
import { useRef } from "react";
import { CardHandle } from "../card/constants";
import { Props, initialState } from "./constants";
import { HistoryItemsHandle } from "../history-items/constants";


export const useInputs = (props: Props) => {

  const { store, historyPanel } = useStore(initialState);
  const HistoryItems = useComponentDownloader(() => import('../history-items'));
  const listItemsRef = useRef<HistoryItemsHandle>(null);
  const cardRef = useRef<CardHandle>(null);

  return {
    props,
    store,
    ...historyPanel,
    cardRef,
    HistoryItems,
    listItemsRef,
  };
}
