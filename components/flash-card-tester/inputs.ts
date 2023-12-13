import { useContextForNestedStore } from "@/utils/constants";
import { NotificationContext } from "@/utils/pages/home/constants";
import { useContext, useRef } from "react";
import { Props, initialState } from "./constants";

export const useInputs = (props: Props) => {

  const store = useContextForNestedStore(initialState)!;
  const items = store.flashCardsForTest.$useState();
  const state = store.flashCard.$useState();
  const notify = useContext(NotificationContext)!;

  return {
    ...state,
    items,
    notify,
    store,
    props,
    bodyRef: useRef<HTMLDivElement>(null),
  }
}