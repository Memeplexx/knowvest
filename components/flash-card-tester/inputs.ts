import { useStore } from "@/utils/store-utils";
import { isAfter } from "date-fns";
import { useMemo, useRef } from "react";
import { useNotifier } from "../notifier";
import { initialState } from "./constants";

export const useInputs = () => {

  const { store, state: { $local, flashCards } } = useStore('flashCardTester', initialState);
  const notify = useNotifier();
  const bodyRef = useRef<HTMLDivElement>(null);
  const items = useMemo(() => {
    return flashCards
      .filter(fc => isAfter(new Date(), fc.nextQuestionDate))
      .map(fc => ({ ...fc, note: store.$state.notes.findOrThrow(n => n.id === fc.noteId) }));
  }, [flashCards, store]);

  return {
    store,
    ...$local,
    items,
    notify,
    bodyRef,
  }
}