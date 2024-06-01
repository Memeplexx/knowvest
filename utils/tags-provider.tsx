"use client";
import { NoteDTO, NoteId, TagId } from '@/actions/types';
import { TagSummary, TagsWorker } from '@/utils/tags-worker';
import { createContext, useContext, useEffect, useState } from "react";
import { useStore } from './store-utils';


type TagsWorkerHandler = {
  addListener: (listener: TagsWorker['onmessage']) => () => void,
  addTags: (arg: TagSummary[]) => void,
  removeTags: (arg: TagId[]) => void,
  updateTags: (arg: TagSummary[]) => void,
  updateNote: (arg: NoteDTO) => void,
  removeNote: (arg: NoteId) => void,
  addNotes: (arg: NoteDTO[]) => void,
};

export const TagsContext = createContext<TagsWorkerHandler | null>(null);

export const useTagsContext = () => useContext(TagsContext)!

export default function TagsProvider({ children }: { children: React.ReactNode }) {

  const { store, state: { stateInitialized } } = useStore();
  const [state, setState] = useState<TagsWorkerHandler | null>(null);

  useEffect(() => {

    // Do not instantiate the worker until certain conditions are met
    if (!stateInitialized) return;

    // Configure object which will be passed to the consumer
    const worker = new Worker(new URL('./tags-worker.ts', import.meta.url)) as TagsWorker;
    const eventListeners = new Array<Parameters<TagsWorkerHandler['addListener']>[0]>();
    const state: TagsWorkerHandler = {
      addListener(listener) {
        eventListeners.push(listener);
        return () => eventListeners.remove(e => e === listener);
      },
      addTags: (data: TagSummary[]) => worker.postMessage({ type: 'addTags', data }),
      removeTags: (data: TagId[]) => worker.postMessage({ type: 'removeTags', data }),
      updateNote: (data: NoteDTO) => worker.postMessage({ type: 'updateNote', data }),
      removeNote: (data: NoteId) => worker.postMessage({ type: 'removeNote', data }),
      updateTags: (data: TagSummary[]) => worker.postMessage({ type: 'updateTags', data }),
      addNotes: (data: NoteDTO[]) => worker.postMessage({ type: 'addNotes', data }),
    };
    worker.onmessage = event => eventListeners.forEach(listener => listener(event));
    setState(state);

    // Ensure that changes to note tags in worker are sent to the store
    // TODO: Consider sending this data to the IndexedDB also.
    state.addListener(event => {
      event.data.forEach(({ noteId, tags }) => {
        if (JSON.stringify(tags) !== JSON.stringify(store.$state.tagNotes[noteId])) {
          store.tagNotes[noteId]!.$set(tags);
        }
      });
      if (!store.$state.tagNotesInitialized)
        store.tagNotesInitialized.$set(true);
    });

    // Ensure that changes to tags in the store are sent to the worker
    state.addTags(store.$state.tags.map(t => ({ id: t.id, text: t.text, synonymId: t.synonymId })));
    const unsubscribeFromTagsChange = store.tags.$onChange((tags, previousTags) => {
      const previousTagIds = previousTags.map(t => t.id);
      const tagsToAdd = tags.filter(t => !previousTagIds.includes(t.id));
      const tagIdsToRemove = previousTagIds.filter(id => !tags.some(t => t.id === id));
      const tagsToUpdate = tags.filter(t => previousTagIds.includes(t.id) && previousTags.find(pt => pt.id === t.id)!.text !== t.text);
      if (tagsToAdd.length) {
        previousTagIds.push(...tagsToAdd.map(t => t.id));
        state.addTags(tagsToAdd);
      }
      if (tagIdsToRemove.length) {
        previousTagIds.remove(e => tagIdsToRemove.includes(e));
        state.removeTags(tagIdsToRemove);
      }
      if (tagsToUpdate.length) {
        state.updateTags(tagsToUpdate);
      }
    });

    // Ensure that changes to notes in the store are sent to the worker
    state.addNotes(store.$state.notes as NoteDTO[]);
    const unsubscribeFromNotesChange = store.notes.$onChange((notes, previousNotes) => {
      const previousNoteIds = previousNotes.map(n => n.id);
      const notesToAdd = notes.filter(n => !previousNoteIds.includes(n.id));
      const noteIdsToRemove = previousNoteIds.filter(id => !notes.some(n => n.id === id));
      const notesToUpdate = notes.filter(n => previousNoteIds.includes(n.id) && previousNotes.find(pn => pn.id === n.id)!.text !== n.text);
      if (notesToAdd.length) {
        previousNoteIds.push(...notesToAdd.map(n => n.id));
        state.addNotes(notesToAdd);
      }
      if (noteIdsToRemove.length) {
        previousNoteIds.remove(e => noteIdsToRemove.includes(e));
        noteIdsToRemove.forEach(id => state.removeNote(id));
      }
      if (notesToUpdate.length) {
        notesToUpdate.forEach(n => state.updateNote(n));
      }
    });

    // Cleanup
    return () => {
      worker.terminate();
      unsubscribeFromTagsChange();
      unsubscribeFromNotesChange();
    }
  }, [store, stateInitialized]);

  return (
    <TagsContext.Provider
      value={state}
      children={children}
    />
  );
}

