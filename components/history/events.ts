import { NoteId } from "@/server/dtos";
import { trpc } from "@/utils/trpc";
import { State } from "./constants";

export const defineEvents = (state: State) => ({
  onSelectNote: async (noteId: NoteId) => {
    const viewed = await trpc.note.view.mutate({ noteId });
    state.appStore.activeNoteId.$set(viewed.id);
    const tagIds = state.appStore.noteTags.$state.filter(nt => nt.noteId === viewed.id).map(nt => nt.tagId);
    const synonymIds = state.appStore.$state.tags.filter(t => tagIds.includes(t.id)).map(t => t.synonymId);
    state.appStore.synonymIds.$set(synonymIds);
    state.onSelectNote(noteId);
  }
})