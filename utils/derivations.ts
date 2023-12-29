import { Store } from "olik";
import { AppState } from "./constants";
import { derive } from "olik/derive";

export const derivations = {
  activeNotesSortedByDateViewed: (store: Store<AppState>) => {
    return derive('activeNotesSortedByDateViewed')
      .$from(store.notes)
      .$with(notes => notes
        .filter(n => !n.isArchived)
        .sort((a, b) => b.dateViewed!.getTime() - a.dateViewed!.getTime()));
  }

}