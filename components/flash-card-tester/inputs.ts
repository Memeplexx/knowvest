import { useContextForNestedStore } from "@/utils/constants";
import { NotificationContext } from "@/utils/pages/home/constants";
import { useContext, useRef } from "react";
import { Props, initialState } from "./constants";
import { isBefore } from "date-fns";
import { derive } from "olik/derive";

export const useInputs = (props: Props) => {

  const store = useContextForNestedStore(initialState)!;
  const state = store.flashCard.$useState();
  const notify = useContext(NotificationContext)!;
  const items = derive(store.flashCards)
    .$with(flashCards => flashCards.filter(fc => !fc.isArchived && isBefore(new Date(), fc.nextQuestionDate)))
    .$useState();

  return {
    ...state,
    items,
    notify,
    store,
    props,
    bodyRef: useRef<HTMLDivElement>(null),
  }
}