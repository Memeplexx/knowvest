import { useActiveNotesSortedByDateViewed, useComponentDownloader, useNotifier, useStore } from '@/utils/hooks';
import { useRef } from 'react';
import { PopupHandle } from '../popup/constants';
import { initialState } from './constants';



export const useInputs = () => {

  const { store, activePanel, activeNoteId } = useStore(initialState);
  const mayDeleteNote = useActiveNotesSortedByDateViewed(store).length > 1;
  const ActiveEditor = useComponentDownloader(() => import('../active-editor'));
  const popupRef = useRef<PopupHandle>(null);
  const notify = useNotifier();
  
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

