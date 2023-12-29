import { useComponentDownloader, useNestedStore } from '@/utils/hooks';
import { NotificationContext } from '@/utils/pages/home/constants';
import { useContext } from 'react';
import { initialState } from './constants';
import { activeNotesSortedByDateViewed } from '@/utils/functions';



export const useInputs = () => {

  const { store, state } = useNestedStore('activePanel', initialState);
  const mayDeleteNote = activeNotesSortedByDateViewed(store).$useState().length > 1;
  const activeNoteId = store.activeNoteId.$useState();
  const downloaded = useComponentDownloader(() => import('../active-editor').then(m => m.ActiveEditor));
  
  return {
    store,
    ...state,
    activeNoteId,
    downloaded,
    mayDeleteNote,
    notify: useContext(NotificationContext)!,
  };
}

