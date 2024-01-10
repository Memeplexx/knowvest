import { useActiveNotesSortedByDateViewed, useComponentDownloader, useStore } from '@/utils/hooks';
import { NotificationContext } from '@/utils/pages/home/constants';
import { useContext, useRef } from 'react';
import { initialState } from './constants';
import { PopupHandle } from '../popup/constants';



export const useInputs = () => {

  const { store, activePanel, activeNoteId } = useStore(initialState);
  const mayDeleteNote = useActiveNotesSortedByDateViewed(store).length > 1;
  const ActiveEditor = useComponentDownloader(() => import('../active-editor'));
  const popupRef = useRef<PopupHandle>(null);
  const notify = useContext(NotificationContext)!
  
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

