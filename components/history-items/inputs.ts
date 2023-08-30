import { derive } from "olik";
import { Props } from "./constants";
import { formatDistanceToNow } from "date-fns";
import { useEffect, useState } from "react";
import { Note } from "@/server/dtos";
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
  notesSorted: Note[]
) => {
  const [notes, setNotes] = useState<(Note & { date: string })[]>([]);
  useEffect(() => {
    setNotes(notesSorted.map(note => ({
      ...note,
      date: formatDistanceToNow(note.dateViewed!, { addSuffix: true }),
    })));
  }, [notesSorted]);
  return notes;
}