"use client";
import { NoteDTO, NoteId, TagId } from '@/actions/types';
import { TagSummary, TagsWorker } from '@/utils/tags-worker';
import { createContext, useContext, useEffect, useState } from "react";
import { useStore } from './store-utils';


type TagsWorkerHandler = {
  addListener: (listener: TagsWorker['onmessage']) => () => void,
  addTags: (arg: TagSummary[]) => void,
  removeTags: (arg: TagId[]) => void,
  updateNote: (arg: NoteDTO) => void,
  removeNote: (arg: NoteId) => void,
};

export const TagsContext = createContext<TagsWorkerHandler | null>(null);

export const useTagsContext = () => useContext(TagsContext)!

export default function TagsProvider({ children }: { children: React.ReactNode }) {

  const { store, state: { stateInitialized } } = useStore();
  const [state, setState] = useState<TagsWorkerHandler | null>(null);

  useEffect(() => {

    if (!stateInitialized) return;

    const worker = new Worker(new URL('./tags-worker.ts', import.meta.url)) as TagsWorker;

    // Configure object which will be passed to the consumer
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
    };
    worker.onmessage = event => eventListeners.forEach(listener => listener(event));
    setState(state);

    // Ensure that tags are in sync with the worker
    worker.postMessage({
      type: 'addTags',
      data: store.$state.tags.map(t => ({ id: t.id, text: t.text, synonymId: t.synonymId })),
    });
    const unsubscribeFromTagsChange = store.tags.$onChange((tags, previousTags) => {
      const previousTagIds = previousTags.map(t => t.id);
      const tagsToAdd = tags.filter(t => !previousTagIds.includes(t.id));
      const tagIdsToRemove = previousTagIds.filter(id => !tags.some(t => t.id === id));
      if (tagsToAdd.length) {
        previousTagIds.push(...tagsToAdd.map(t => t.id));
        state.addTags(tagsToAdd);
      } else {
        previousTagIds.remove(e => tagIdsToRemove.includes(e));
        state.removeTags(tagIdsToRemove);
      }
    });

    // Cleanup
    return () => {
      worker.terminate();
      unsubscribeFromTagsChange();
    }
  }, [store, stateInitialized]);

  return (
    <TagsContext.Provider
      value={state}
      children={children}
    />
  );
}

