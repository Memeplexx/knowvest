import { derive } from "olik/derive";
import { HistoryItemsStore, Props, initialState, pageSize, tag } from "./constants";
import { formatDistanceToNow } from "date-fns";
import { useEffect, useImperativeHandle, useState } from "react";
import { NoteDTO } from "@/server/dtos";
import { useNestedStore } from "@/utils/hooks";
import { derivations } from "@/utils/derivations";

export const useInputs = (
  props: Props,
) => {

  const { store, state } = useNestedStore(tag, initialState);

  const notesSorted = useNotesSortedAndSliced(store);

  const notes = useEmbellishNotesWithDates(notesSorted);
  
  useImperativeHandle(props.innerRef, () => ({
    onScrollToBottom: () => store.historyItems.index.$add(1),
  }), [store]);

  return {
    props,
    store,
    notes,
    ...state,
  };
}

const useNotesSortedAndSliced = (store: HistoryItemsStore) => derive(tag).$from(
  derivations.activeNotesSortedByDateViewed(store),
  store.activeNoteId,
  store.historyItems.index,
).$with((notes, activeNoteId, index) => {
  return notes
    .filter(note => activeNoteId !== note.id)
    .slice(0, (index + 1) * pageSize); // TODO: Paginate this list!
}).$useState();

const useEmbellishNotesWithDates = (
  notesSorted: NoteDTO[]
) => {
  const [notes, setNotes] = useState<(NoteDTO & { date: string })[]>([]);
  useEffect(() => {
    setNotes(notesSorted.map(note => ({
      ...note,
      date: formatDistanceToNow(note.dateViewed!, { addSuffix: true }),
    })));
  }, [notesSorted]);
  return notes;
}