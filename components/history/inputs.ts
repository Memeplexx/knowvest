import { useComponentDownloader, useNestedStore } from "@/utils/hooks";
import { useRef } from "react";
import { CardHandle } from "../card/constants";
import { Props, initialState, tag } from "./constants";
import { HistoryItemsHandle } from "../history-items/constants";


export const useInputs = (props: Props) => {

  const { store, state } = useNestedStore(tag, initialState);
  const HistoryItems = useComponentDownloader(() => import('../history-items'));
  const listItemsRef = useRef<HistoryItemsHandle>(null);
  const cardRef = useRef<CardHandle>(null);

  return {
    props,
    store,
    ...state,
    cardRef,
    HistoryItems,
    listItemsRef,
  };
}
