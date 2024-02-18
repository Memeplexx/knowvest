import { useStore } from "@/utils/hooks";
import { isAfter } from "date-fns";
import { useMemo, useRef } from "react";
import { Props, initialState } from "./constants";
import { useNotifier } from "../notifier";

export const useInputs = (props: Props) => {

  const { store, flashCardTester, flashCards } = useStore(initialState);
  const notify = useNotifier();
  const bodyRef = useRef<HTMLDivElement>(null);
  const items = useMemo(() => {
    return flashCards
      .filter(fc => !fc.isArchived && isAfter(new Date(), fc.nextQuestionDate))
      .map(fc => ({...fc, note: store.$state.notes.findOrThrow(n => n.id === fc.noteId)}));
  }, [flashCards, store]);

  return {
    ...flashCardTester,
    items,
    notify,
    store,
    props,
    bodyRef,
  }
}