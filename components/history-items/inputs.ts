import { derive } from "olik";
import { Props } from "./constants";
import { formatDistanceToNow } from "date-fns";
import { useEffect, useState } from "react";
import { NoteDTO } from "@/server/dtos";
import { store } from "@/utils/store";

export const useInputs = (props: Props) => {

  const notesSorted = useNotesSortedAndSliced();

  const notes = useEmbellishNotesWithDates(notesSorted);

  return {
    props,
    state: {
      notes,
    }
  };
}

const useNotesSortedAndSliced = () => {
  return derive(
    store.notes,
    store.activeNoteId,
  ).$with((notes, activeNoteId) => {
    return notes
      .filter(note => activeNoteId !== note.id)
      .sort((a, b) => b.dateViewed!.toISOString().localeCompare(a.dateViewed!.toISOString()))
      .slice(0, 40)
  }).$useState();
}

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