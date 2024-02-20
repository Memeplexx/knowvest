import { useStore } from "@/utils/store-utils";
import { useRef } from "react";
import { CardHandle } from "../card/constants";
import { HistoryItemsHandle } from "../history-items/constants";
import { Props } from "./constants";
import { useComponentDownloader } from "@/utils/react-utils";


export const useInputs = (props: Props) => {

  const { store } = useStore();
  const HistoryItems = useComponentDownloader(() => import('../history-items'));
  const listItemsRef = useRef<HistoryItemsHandle>(null);
  const cardRef = useRef<CardHandle>(null);

  return {
    props,
    store,
    cardRef,
    HistoryItems,
    listItemsRef,
  };
}
