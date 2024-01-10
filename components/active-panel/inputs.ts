import { useActiveNotesSortedByDateViewed, useComponentDownloader, useNestedStore } from '@/utils/hooks';
import { NotificationContext } from '@/utils/pages/home/constants';
import { useContext, useRef } from 'react';
import { initialState, tag } from './constants';
import { PopupHandle } from '../popup/constants';



export const useInputs = () => {

  const { store, state } = useNestedStore(tag, initialState);
  const mayDeleteNote = useActiveNotesSortedByDateViewed(store).length > 1;
  const activeNoteId = store.activeNoteId.$useState();
  const ActiveEditor = useComponentDownloader(() => import('../active-editor'));
  const popupRef = useRef<PopupHandle>(null);
  const notify = useContext(NotificationContext)!
  
  return {
    store,
    ...state,
    activeNoteId,
    ActiveEditor,
    mayDeleteNote,
    popupRef,
    notify,
  };
}

