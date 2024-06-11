import { initialize } from "@/actions/session";
import { FlashCardDTO, GroupDTO, NoteDTO, SynonymGroupDTO, TagDTO, UserDTO } from "@/actions/types";
import { MediaQueries, useMediaQueryListener, useResizeListener } from "@/utils/dom-utils";
import { PromiseObject } from "@/utils/logic-utils";
import { useComponent } from "@/utils/react-utils";
import { deleteFromDb, initializeDb, readFromDb, writeToDb } from "@/utils/storage-utils";
import { useLocalStore, useStore } from "@/utils/store-utils";
import { TagsWorker } from "@/utils/tags-worker";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { initialState } from "./constants";


export const useInputs = () => {

  const { store } = useStore();
  const { local, state } = useLocalStore('home', initialState);
  const component = useComponent();
  const result = { store, local, ...state };
  useMediaQueryListener(store.mediaQuery.$set);

  // Update header visibility as required
  useResizeListener(() => {
    if (window.innerWidth >= MediaQueries.md && !local.$state.headerExpanded)
      local.headerExpanded.$set(true);
    else if (window.innerWidth < MediaQueries.md && local.$state.headerExpanded)
      local.headerExpanded.$set(false);
  });

  // Log user out if session expired
  const session = useSession();
  if (session.status === 'unauthenticated')
    redirect('/?session-expired=true');

  // Do not continue under certain conditions
  if (!component.isMounted)
    return result;
  if (!session.data)
    return result;
  if (state.stage !== 'pristine')
    return result;

  local.stage.$set('initializeData');
  void async function initializeData() {
    await initializeDb();
    const databaseData = await PromiseObject({
      notes: readFromDb('notes'),
      tags: readFromDb('tags'),
      groups: readFromDb('groups'),
      synonymGroups: readFromDb('synonymGroups'),
      flashCards: readFromDb('flashCards')
    });
    const apiResponse = await initialize({
      user: session.data.user as UserDTO,
      after: {
        notes: databaseData.notes[0]?.dateUpdated ?? null,
        tags: databaseData.tags[0]?.dateUpdated ?? null,
        groups: databaseData.groups[0]?.dateUpdated ?? null,
        synonymGroups: databaseData.synonymGroups[0]?.dateUpdated ?? null,
        flashCards: databaseData.flashCards[0]?.dateUpdated ?? null
      }
    });
    if (apiResponse.status === 'USER_CREATED') {
      store.$patch({
        notes: [apiResponse.firstNote],
        activeNoteId: apiResponse.firstNote.id
      });
    } else {
      await Promise.all([
        writeToDb('notes', apiResponse.notes),
        writeToDb('tags', apiResponse.tags),
        writeToDb('groups', apiResponse.groups),
        writeToDb('synonymGroups', apiResponse.synonymGroups),
        writeToDb('flashCards', apiResponse.flashCards),
      ]);
      const filterUnArchived = <T extends object>(item: T) => 'isArchived' in item ? !item.isArchived : true;
      store.$patch({ // NOTE: Database might be empty. If so, use the first note from the API response
        activeNoteId: databaseData.notes[0]?.id ?? apiResponse.notes[0]!.id,
        notes: [...databaseData.notes, ...apiResponse.notes].filter(filterUnArchived),
        tags: [...databaseData.tags, ...apiResponse.tags].filter(filterUnArchived),
        groups: [...databaseData.groups, ...apiResponse.groups].filter(filterUnArchived),
        synonymGroups: [...databaseData.synonymGroups, ...apiResponse.synonymGroups].filter(filterUnArchived),
        flashCards: [...databaseData.flashCards, ...apiResponse.flashCards].filter(filterUnArchived),
      });
    }

    // Configure object which will be passed to the consumer
    const worker = new Worker(new URL('../../utils/tags-worker.ts', import.meta.url)) as TagsWorker;
    component.listen = () => worker.terminate();

    // Ensure that changes to note tags in worker are sent to the store
    // TODO: Consider sending this data to the IndexedDB also.
    let first = true;
    worker.onmessage = event => {
      event.data
        .filter(({ noteId, tags }) => JSON.stringify(tags) !== JSON.stringify(store.$state.noteTags[noteId]))
        .forEach(({ noteId, tags }) => store.noteTags[noteId]!.$set(tags));
      if (!first)
        return;
      first = false;
      const synonymIds = event.data.find(e => e.noteId === store.$state.activeNoteId)!.tags.map(t => t.synonymId!);
      store.synonymIds.$set(synonymIds);
      local.stage.$set('done');
    }

    // Send the tags worker the initial data
    const sanitizeNote = (note: NoteDTO) => ({ ...note, text: note.text.toLowerCase() });
    const sanitizeTag = (tag: TagDTO) => ({ id: tag.id, synonymId: tag.synonymId, text: tag.text.toLowerCase() });
    worker.postMessage({
      type: 'initialize',
      data: { notes: store.$state.notes.map(sanitizeNote), tags: store.$state.tags.map(sanitizeTag) }
    });

    // Ensure that changes to tags in the store are sent to the worker
    component.listen = store.tags.$onChange((tags, previousTags) => {
      const previousTagIds = previousTags.map(t => t.id);
      const tagsToAdd = tags.filter(t => !previousTagIds.includes(t.id));
      const tagIdsToRemove = previousTagIds.filter(id => !tags.some(t => t.id === id));
      const tagsToUpdate = tags.filter(t => {
        const found = previousTags.find(pt => pt.id === t.id);
        return found && found.text !== t.text;
      });
      if (tagsToAdd.length)
        worker.postMessage({ type: 'addTags', data: tagsToAdd.map(sanitizeTag) });
      if (tagIdsToRemove.length)
        worker.postMessage({ type: 'removeTags', data: tagIdsToRemove });
      if (tagsToUpdate.length)
        worker.postMessage({ type: 'updateTags', data: tagsToUpdate.map(sanitizeTag) });
    });

    // Ensure that changes to notes in the store are sent to the worker
    component.listen = store.notes.$onChange((notes, previousNotes) => {
      const previousNoteIds = previousNotes.map(n => n.id);
      const notesToAdd = notes.filter(n => !previousNoteIds.includes(n.id));
      const noteIdsToRemove = previousNoteIds.filter(id => !notes.some(n => n.id === id));
      const notesToUpdate = notes.filter(n => previousNoteIds.includes(n.id) && previousNotes.find(pn => pn.id === n.id)!.text !== n.text);
      if (notesToAdd.length)
        worker.postMessage({ type: 'addNotes', data: notesToAdd.map(sanitizeNote) });
      if (noteIdsToRemove.length)
        noteIdsToRemove.forEach(id => worker.postMessage({ type: 'removeNote', data: id }));
      if (notesToUpdate.length)
        notesToUpdate.forEach(n => worker.postMessage({ type: 'updateNote', data: sanitizeNote(n) }));
    });

    // Ensure that the indexedDB is updated when the store changes
    component.listen = store.notes.$onInsertElements(async notes => await writeToDb('notes', notes as NoteDTO[]));
    component.listen = store.notes.$onUpdateElements(async notes => await writeToDb('notes', notes as NoteDTO[]));
    component.listen = store.notes.$onDeleteElements(async notes => await deleteFromDb('notes', notes.map(n => n.id)));

    component.listen = store.tags.$onInsertElements(async tags => await writeToDb('tags', tags as TagDTO[]));
    component.listen = store.tags.$onUpdateElements(async tags => await writeToDb('tags', tags as TagDTO[]));
    component.listen = store.tags.$onDeleteElements(async tags => await deleteFromDb('tags', tags.map(t => t.id)));

    component.listen = store.synonymGroups.$onInsertElements(async synonymGroups => await writeToDb('synonymGroups', synonymGroups as SynonymGroupDTO[]));
    component.listen = store.synonymGroups.$onUpdateElements(async synonymGroups => await writeToDb('synonymGroups', synonymGroups as SynonymGroupDTO[]));
    component.listen = store.synonymGroups.$onDeleteElements(async synonymGroups => await deleteFromDb('synonymGroups', synonymGroups.map(p => p.id)));

    component.listen = store.groups.$onInsertElements(async groups => await writeToDb('groups', groups as GroupDTO[]));
    component.listen = store.groups.$onUpdateElements(async groups => await writeToDb('groups', groups as GroupDTO[]));
    component.listen = store.groups.$onDeleteElements(async groups => await deleteFromDb('groups', groups.map(p => p.id)));

    component.listen = store.flashCards.$onInsertElements(async flashCards => await writeToDb('flashCards', flashCards as FlashCardDTO[]));
    component.listen = store.flashCards.$onUpdateElements(async flashCards => await writeToDb('flashCards', flashCards as FlashCardDTO[]));
    component.listen = store.flashCards.$onDeleteElements(async flashCards => await deleteFromDb('flashCards', flashCards.map(p => p.id)));
  }();

  return result;
}
