import { useLocalStore, useStore } from "@/utils/store-utils";
import { formatDistanceToNow } from "date-fns";
import { useMemo, useRef } from "react";
import { Props, initialState, pageSize } from "./constants";
import { CardHandle } from "../card/constants";
import { useUnknownPropsStripper } from "@/utils/react-utils";

export const useInputs = (
  props: Props,
) => {

  const { store, state: { activeNoteId, notes, stateInitialized } } = useStore();
  const { local, state: { index } } = useLocalStore('historyItems', initialState);

  const cardRef = useRef<CardHandle>(null);

  const items = useMemo(() => {
    return notes
      .filter(note => activeNoteId !== note.id)
      .sort((a, b) => b.dateViewed!.getTime() - a.dateViewed!.getTime())
      .slice(0, (index + 1) * pageSize)
      .map(note => ({
        ...note,
        date: formatDistanceToNow(note.dateViewed!, { addSuffix: true }),
      }));
  }, [activeNoteId, index, notes]);

  const htmlProps = useUnknownPropsStripper({ ...props });

  return {
    store,
    local,
    ...local.$state,
    items,
    stateInitialized,
    cardRef,
    htmlProps,
  };
}
