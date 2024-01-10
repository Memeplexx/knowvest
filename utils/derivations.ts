import { Store } from "olik";
import { AppState } from "./constants";
import { NoteDTO, NoteTagDTO, SynonymId } from "@/server/dtos";

export const derivations = new (class {
  #notes: Array<NoteDTO> = [];
  #noteTags: Array<NoteTagDTO> = [];
  activeNotesSortedByDateViewed = (store: Store<AppState>) => {
    this.#notes = store.$state.notes
      .filter(n => !n.isArchived)
      .sort((a, b) => b.dateViewed!.getTime() - a.dateViewed!.getTime());
    return this.#notes;
  }
  editorNoteTags = (store: Store<AppState>, synonymIds: SynonymId[]) => {
    const { tags, noteTags, synonymGroups } = store.$state
    const groupSynonymIds = synonymGroups
      .filter(sg => synonymIds.includes(sg.synonymId))
      .distinct();
    this.#noteTags = [...synonymIds, ...groupSynonymIds]
      .flatMap(synonymId => tags.filter(t => t.synonymId === synonymId))
      .distinct(t => t.id)
      .flatMap(t => noteTags.filter(nt => nt.tagId === t.id));
    return this.#noteTags;
  };
})();