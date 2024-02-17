import { useComponentDownloader, useNotifier, useStore } from '@/utils/hooks';
import { useMemo, useRef } from 'react';
import { PopupHandle } from '../popup/constants';
import { initialState } from './constants';


export const useInputs = () => {

  const { store, activePanel, activeNoteId, notes } = useStore(initialState);
  const ActiveEditor = useComponentDownloader(() => import('../active-editor'));
  const popupRef = useRef<PopupHandle>(null);
  const notify = useNotifier();
  const mayDeleteNote = useMemo(() => {
    return notes.filter(n => !n.isArchived).length > 1;
  }, [notes])
  
  return {
    store,
    activePanel,
    activeNoteId,
    ActiveEditor,
    mayDeleteNote,
    popupRef,
    notify,
  };
}

