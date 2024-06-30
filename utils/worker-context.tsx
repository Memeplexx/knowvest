"use client"
import { NoteDTO, NoteId, TagId } from '@/actions/types';
import { DeepReadonlyArray } from 'olik/*';
import { ReactNode, createContext, useContext, useEffect, useState } from 'react';
import { NoteTags, TagSummary, TagsWorker } from './tags-worker';


type WorkerContext = {
  initialize: (payload: { tags: DeepReadonlyArray<TagSummary>, notes: DeepReadonlyArray<NoteDTO> }) => void;
  addTags: (tags: TagSummary[]) => void;
  addNotes: (notes: DeepReadonlyArray<NoteDTO>) => void;
  removeTags: (tags: DeepReadonlyArray<TagId>) => void;
  updateTags: (tags: DeepReadonlyArray<TagSummary>) => void;
  updateNote: (note: NoteDTO) => void;
  removeNote: (noteId: NoteId) => void;
  setSearchTerms: (terms: DeepReadonlyArray<string>) => void;
  onNoteTagsUpdated: (listener: (arg: DeepReadonlyArray<NoteTags>) => void) => () => void;
  onNotesSearched: (listener: (arg: DeepReadonlyArray<NoteTags>) => void) => () => void;
};

const MyContext = createContext<WorkerContext | undefined>(undefined);

export const TagsWorkerProvider = ({ children }: { children: ReactNode }) => {
  const [worker, setWorker] = useState<WorkerContext | null>(null);
  useEffect(() => {
    const worker = new Worker(new URL('./tags-worker.ts', import.meta.url)) as TagsWorker;
    const onNoteTagsUpdatedListeners = new Set<(value: NoteTags[]) => void>();
    const onNotesSearchedListeners = new Set<(value: NoteTags[]) => void>();
    worker.onmessage = ({ data }) => {
      if (data.type === 'noteTagsUpdated')
        onNoteTagsUpdatedListeners.forEach(listener => listener(data.value));
      if (data.type === 'notesSearched')
        onNotesSearchedListeners.forEach(listener => listener(data.value));
    };
    setWorker({
      initialize: data => worker.postMessage({ type: 'initialize', data }),
      addTags: data => worker.postMessage({ type: 'addTags', data }),
      addNotes: data => worker.postMessage({ type: 'addNotes', data }),
      removeTags: data => worker.postMessage({ type: 'removeTags', data }),
      updateTags: data => worker.postMessage({ type: 'updateTags', data }),
      updateNote: data => worker.postMessage({ type: 'updateNote', data }),
      removeNote: data => worker.postMessage({ type: 'removeNote', data }),
      setSearchTerms: data => worker.postMessage({ type: 'setSearchTerms', data }),
      onNoteTagsUpdated: listener => {
        onNoteTagsUpdatedListeners.add(listener);
        return () => onNoteTagsUpdatedListeners.delete(listener);
      },
      onNotesSearched: listener => {
        onNotesSearchedListeners.add(listener);
        return () => onNotesSearchedListeners.delete(listener);
      },
    });
    return () => worker?.terminate();
  }, []);
  return (
    <MyContext.Provider
      value={worker!}
      children={children}
    />
  );
};

export const useTagsWorker = () => useContext(MyContext)!;
