import { NotificationContext } from "@/utils/pages/home/constants";
import { useContext, useRef } from "react";
import { Props, initialState, tag } from "./constants";
import { isAfter } from "date-fns";
import { derive } from "olik/derive";
import { useNestedStore } from "@/utils/hooks";

export const useInputs = (props: Props) => {

  const { store, state } = useNestedStore('flashCard', initialState);
  const notify = useContext(NotificationContext)!;
  const items = derive(tag).$from(store.flashCards)
    .$with(flashCards => flashCards.filter(fc => !fc.isArchived && isAfter(new Date(), fc.nextQuestionDate)))
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