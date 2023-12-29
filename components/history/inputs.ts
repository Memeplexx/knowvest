import { useComponentDownloader, useNestedStore } from "@/utils/hooks";
import { useRef } from "react";
import { CardHandle } from "../card/constants";
import { Props, initialState } from "./constants";
import { HistoryItemsHandle } from "../history-items/constants";


export const useInputs = (props: Props) => {

  const { store, state } = useNestedStore('history', initialState);
  const downloaded = useComponentDownloader(() => import('../history-items').then(m => m.HistoryItems));
  const listItemsRef = useRef<HistoryItemsHandle>(null);

  return {
    props,
    store,
    ...state,
    cardRef: useRef<CardHandle>(null),
    downloaded,
    listItemsRef,
  };
}
