import { useNotifier } from "@/components/notifier";
import { store, useLocalStore, useStore } from "@/utils/store-utils";
import { isAfter } from "date-fns";
import { useMemo } from "react";
import { initialState } from "./constants";

export const useInputs = () => {

  const { flashCards } = useStore();
  const { local } = useLocalStore('flashCardTester', initialState);
  const notify = useNotifier();

  const items = useMemo(() => {
    return flashCards
      .filter(fc => isAfter(new Date(), fc.nextQuestionDate))
      .map(fc => ({ ...fc, note: store.$state.notes.findOrThrow(n => n.id === fc.noteId) }));
  }, [flashCards]);

  return {
    local,
    ...local.$state,
    items,
    notify,
  }
}