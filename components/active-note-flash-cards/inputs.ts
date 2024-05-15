import { useStore } from "@/utils/store-utils";
import { useMemo } from "react";
import { useNotifier } from "../notifier";
import { initialState } from "./constants";



export const useInputs = () => {

  const notify = useNotifier();
  const { store, localState, localStore, flashCards, activeNoteId } = useStore({ key: 'activeFlashCards', value: initialState });
  const items = useMemo(() => {
    return flashCards.filter(fc => fc.noteId === activeNoteId);
  }, [flashCards, activeNoteId]);

  return {
    notify,
    store,
    localStore,
    ...localState,
    items,
  }
}

