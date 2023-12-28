import { useComponentDownloader, useNestedStore } from "@/utils/hooks";
import { useRef } from "react";
import { CardHandle } from "../card/constants";
import { Props, initialState } from "./constants";


export const useInputs = (props: Props) => {

  const { store, state } = useNestedStore('history', initialState)!;
  const downloaded = useComponentDownloader(() => import('../history-items'));

  return {
    props,
    store,
    ...state,
    cardRef: useRef<CardHandle>(null),
    downloaded,
  };
}
