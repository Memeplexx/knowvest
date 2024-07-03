"use client"
import { ReactNode, createContext, useContext, useEffect, useState } from 'react';
import { NoteSearchResults, TagsWorker, TextSearchContextActions } from './text-search-utils';


const TextSearchContext = createContext<TextSearchContextActions | undefined>(undefined);

export const TextSearchProvider = ({ children }: { children: ReactNode }) => {
  const [worker, setWorker] = useState<TextSearchContextActions | null>(null);
  useEffect(() => {
    const worker = new Worker(new URL('./text-search-worker.ts', import.meta.url)) as TagsWorker;
    const onNoteTagsUpdatedListeners = new Set<(value: NoteSearchResults[]) => void>();
    const onNotesSearchedListeners = new Set<(value: NoteSearchResults[]) => void>();
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
    <TextSearchContext.Provider
      value={worker!}
      children={children}
    />
  );
};

export const useTextSearcher = () => useContext(TextSearchContext)!;
