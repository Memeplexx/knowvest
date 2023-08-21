import { Store, derive } from "olik";
import { Props } from "./constants";
import { formatDistanceToNow } from "date-fns";
import { useContext, useEffect, useState } from "react";
import { Note } from "@/server/dtos";
import { AppStoreState } from "@/utils/types";
import { OlikContext } from "@/utils/pages/home/constants";

export const useHooks = (props: Props) => {

  const appStore = useContext(OlikContext)!;

  const notesSorted = useNotesSortedAndSliced(appStore);

  const notes = useEmbellishNotesWithDates(notesSorted);

  return {
    ...props,
    notes,
    appStore,
  };
}

const useNotesSortedAndSliced = (
  appStore: Store<AppStoreState>,
) => {
  return derive(
    appStore.notes,
    appStore.activeNoteId,
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