import { useStore } from "@/utils/store-utils";
import { useMemo, useRef } from "react";
import { Props, initialState, pageSize } from "./constants";
import { CardHandle } from "../card/constants";
import { useUnknownPropsStripper } from "@/utils/react-utils";

export const useInputs = (
  props: Props,
) => {

  const { store, localState, localStore, notes, tags, noteTags, synonymIds, activeNoteId, stateInitialized } = useStore({
    key: 'relatedItems',
    value: initialState
  });

  const cardRef = useRef<CardHandle>(null);

  const items = useMemo(() => {
    return synonymIds
      .flatMap(synonymId => tags.filter(t => t.synonymId === synonymId))
      .map(t => t.id)
      .distinct()
      .flatMap(tagId => noteTags.filter(nt => nt.noteId !== activeNoteId && nt.tagId === tagId))
      .groupBy(n => n.noteId)
      .map(noteTagGroup => ({
        note: notes.findOrThrow(note => note.id === noteTagGroup[0]!.noteId),
        count: noteTagGroup.length,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, (localState.index + 1) * pageSize)
      .map(n => ({
        ...n,
        matches: `${n.count} match${n.count === 1 ? '' : 'es'}`,
      }));
  }, [activeNoteId, notes, tags, noteTags, synonymIds, localState.index]);

  const noteCountString = useMemo(() => {
    return `${items.length} result${items.length === 1 ? '' : 's'}`;
  }, [items]);

  const htmlProps = useUnknownPropsStripper({ ...props });

  return {
    store,
    items,
    localStore,
    stateInitialized,
    noteCountString,
    cardRef,
    htmlProps,
  }

};