import { ActiveNoteFlashCards } from "@/components/active-note-flash-cards";
import { Tags } from "@/components/tags";
import { useStore } from "@/utils/store-utils";
import { useMemo } from "react";


export const useInputs = () => {
  const { store, state: { mediaQuery } } = useStore();
  const isMobileWidth = mediaQuery === 'xs' || mediaQuery === 'sm';
  const tabOptions = useMemo(() => [
    { label: 'Tags', panel: Tags },
    { label: 'Flashcards', panel: ActiveNoteFlashCards },
  ], []);
  return {
    store,
    tabOptions,
    isMobileWidth,
  };
}
