import { ActiveNoteFlashCards } from "@/components/active-note-flash-cards";
import { Tags } from "@/components/tags";
import { useLocalStore, useStore } from "@/utils/store-utils";
import { useMemo } from "react";
import { initialState } from "./constants";


export const useInputs = () => {
  const { store, state: { mediaQuery } } = useStore();
  const { local, state } = useLocalStore('home', initialState);
  const isMobileWidth = mediaQuery === 'xs' || mediaQuery === 'sm';
  const tabOptions = useMemo(() => [
    { label: 'Tags', panel: Tags },
    { label: 'Flashcards', panel: ActiveNoteFlashCards },
  ], []);
  return {
    store,
    local,
    tabOptions,
    isMobileWidth,
    ...state
  };
}
