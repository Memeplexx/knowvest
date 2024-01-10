import { NotificationContext } from "@/utils/pages/home/constants";
import { useContext, useMemo, useRef } from "react";
import { Props, initialState } from "./constants";
import { isAfter } from "date-fns";
import { useStore } from "@/utils/hooks";

export const useInputs = (props: Props) => {

  const { store, flashCardTester, flashCards } = useStore(initialState);
  const notify = useContext(NotificationContext)!;
  const bodyRef = useRef<HTMLDivElement>(null);
  const items = useMemo(() => {
    return flashCards.filter(fc => !fc.isArchived && isAfter(new Date(), fc.nextQuestionDate));
  }, [flashCards]);

  return {
    ...flashCardTester,
    items,
    notify,
    store,
    props,
    bodyRef,
  }
}