import { useStorageContext } from "@/utils/storage-provider";
import { useLocalStore, useStore } from "@/utils/store-utils";
import { useMemo } from "react";
import { useNotifier } from "../notifier";
import { initialState } from "./constants";



export const useInputs = () => {

  const { store, state: { flashCards, activeNoteId } } = useStore();
  const { local, state } = useLocalStore('activeFlashCards', initialState);
  const notify = useNotifier();
  const storage = useStorageContext();

  const items = useMemo(() => {
    return flashCards.filter(fc => fc.noteId === activeNoteId);
  }, [flashCards, activeNoteId]);

  return {
    notify,
    store,
    local,
    state,
    items,
    storage,
    ...local.$state,
  }
}

