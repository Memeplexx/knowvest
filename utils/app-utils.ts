import { viewNote } from "@/actions/note";
import { NoteId } from "@/actions/types";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { } from "next/navigation";
import { store } from "./store-utils";

export const onSelectNote = async (router: AppRouterInstance, noteId: NoteId) => {
  const { searchResults, tags } = store.$state;
  const tagIds = searchResults.filter(r => r.noteId === noteId).map(r => r.id);
  const synonymIds = tags.filter(tag => tagIds.includes(tag.id)).map(t => t.synonymId);
  store.activeNoteId.$set(noteId);
  store.synonymIds.$set(synonymIds);
  const apiResponse = await viewNote(noteId);
  store.notes.$find.id.$eq(noteId).dateUpdated.$set(apiResponse.note.dateUpdated);
  if (store.$state.isMobileWidth)
    router.push('/app/home');
}