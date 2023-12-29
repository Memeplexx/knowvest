import { derive } from "olik/derive";
import { Props, tag } from "./constants";
import { formatDistanceToNow } from "date-fns";
import { useContext, useEffect, useState } from "react";
import { NoteDTO } from "@/server/dtos";
import { Store } from "olik";
import { AppState, StoreContext } from "@/utils/constants";
import { activeNotesSortedByDateViewed } from "@/utils/functions";

export const useInputs = (props: Props) => {

  const store = useContext(StoreContext)!;

  const notesSorted = useNotesSortedAndSliced(store);

  const notes = useEmbellishNotesWithDates(notesSorted);

  return {
    props,
    store,
    notes,
  };
}

const useNotesSortedAndSliced = (store: Store<AppState>) => derive(tag).$from(
  activeNotesSortedByDateViewed(store),
  store.activeNoteId,
).$with((notes, activeNoteId) => {
  return notes
    .filter(note => activeNoteId !== note.id)
    .slice(0, 40); // TODO: Virtualize this list!
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