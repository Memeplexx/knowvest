import { viewNote } from "@/actions/note";
import { NoteId } from "@/actions/types";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { } from "next/navigation";
import { store } from "./store-utils";


export const globalStylesWrapperId = 'global-styles-wrapper';

export const onSelectNote = async (router: AppRouterInstance, noteId: NoteId) => {
  const complete = async () => {
    const { searchResults, tags } = store.$state;
    const tagIds = searchResults.filter(r => r.noteId === noteId).map(r => r.tagId);
    store.activeNoteId.$set(noteId);
    store.synonymIds.$set(tags.filter(tag => tagIds.includes(tag.id)).map(t => t.synonymId).distinct().sort((a, b) => a - b));
    const apiResponse = await viewNote(noteId);
    store.notes.$find.id.$eq(noteId).dateUpdated.$set(apiResponse.note.dateUpdated);
  };
  if (store.$state.isMobileWidth) {
    router.push('/app/home');
    onRouteToChange('/app/home', complete);
  } else {
    await complete();
  }
}

/**
 * There is no way to know when the route has changed in the mobile app, so we have to poll the route until it changes.
 * Note that is is all to avoid weird jumping behavior in the mobile app. Rather change the route, and then change the state.
 */
const onRouteToChange = (targetRoute: string, action: () => void) => {
  const recurse = () => {
    setTimeout(() => {
      if (window.location.pathname !== targetRoute)
        return recurse();
      return action();
    }, 10);
  }
  recurse();
}