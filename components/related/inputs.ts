import { useLocalStore, useStore } from "@/utils/store-utils";
import { useMemo, useRef } from "react";
import { Props, initialState, pageSize } from "./constants";
import { CardHandle } from "../card/constants";
import { useUnknownPropsStripper } from "@/utils/react-utils";

export const useInputs = (
  props: Props,
) => {

  const { store, state: { notes, tags, noteTags, synonymIds, activeNoteId, stateInitialized } } = useStore();
  const { local, state: { index } } = useLocalStore('relatedItems', initialState);

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
      .slice(0, (index + 1) * pageSize)
      .map(n => ({
        ...n,
        matches: `${n.count} match${n.count === 1 ? '' : 'es'}`,
      }));
  }, [synonymIds, index, tags, noteTags, activeNoteId, notes]);

  const noteCountString = useMemo(() => {
    return `${items.length} result${items.length === 1 ? '' : 's'}`;
  }, [items]);

  const htmlProps = useUnknownPropsStripper({ ...props });

  return {
    store,
    local,
    items,
    stateInitialized,
    noteCountString,
    cardRef,
    htmlProps,
  }

};