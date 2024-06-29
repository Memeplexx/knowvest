import { viewNote } from "@/actions/note";
import { NoteId } from "@/actions/types";
import { AppStore } from "./store-utils";

export const onSelectNote = async (store: AppStore, noteId: NoteId) => {
  const { noteTags, tags } = store.$state;
  const tagIds = noteTags.filter(nt => nt.noteId === noteId).map(nt => nt.id);
  const synonymIds = tags.filter(tag => tagIds.includes(tag.id)).map(t => t.synonymId);
  store.activeNoteId.$set(noteId);
  store.synonymIds.$set(synonymIds);
  const apiResponse = await viewNote(noteId);
  store.notes.$find.id.$eq(noteId).dateUpdated.$set(apiResponse.note.dateUpdated);
}