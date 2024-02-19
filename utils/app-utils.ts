import { NoteDTO } from "@/actions/types";


export const getNotesSorted = (notes: NoteDTO[]) => {
  return notes
    .filter(n => !n.isArchived)
    .sort((a, b) => b.dateViewed!.getTime() - a.dateViewed!.getTime());
}
