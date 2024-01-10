import { NotificationContext } from "@/utils/pages/home/constants";
import { useContext, useMemo, useRef } from "react";
import { Props, initialState } from "./constants";
import { isAfter } from "date-fns";
import { useNestedStore } from "@/utils/hooks";

export const useInputs = (props: Props) => {

  const { store, state } = useNestedStore('flashCard', initialState);
  const notify = useContext(NotificationContext)!;
  const flashCards = store.flashCards.$useState();
  const items = useMemo(() => {
    return flashCards.filter(fc => !fc.isArchived && isAfter(new Date(), fc.nextQuestionDate));
  }, [flashCards]);

  return {
    ...state,
    items,
    notify,
    store,
    props,
    bodyRef: useRef<HTMLDivElement>(null),
  }
}