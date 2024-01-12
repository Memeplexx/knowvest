import { useNotifier, useStore } from "@/utils/hooks";
import { isAfter } from "date-fns";
import { useMemo, useRef } from "react";
import { Props, initialState } from "./constants";

export const useInputs = (props: Props) => {

  const { store, flashCardTester, flashCards } = useStore(initialState);
  const notify = useNotifier();
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