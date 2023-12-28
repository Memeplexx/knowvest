import { useComponentDownloader, useNestedStore } from '@/utils/hooks';
import { NotificationContext } from '@/utils/pages/home/constants';
import { useContext } from 'react';
import { initialState } from './constants';



export const useInputs = () => {

  const { store, state } = useNestedStore('activePanel', initialState);
  const mayDeleteNote = store.notes.$useState().length > 1;
  const activeNoteId = store.activeNoteId.$useState();
  const downloaded = useComponentDownloader(() => import('../active-editor'));
  
  return {
    store,
    ...state,
    activeNoteId,
    downloaded,
    mayDeleteNote,
    notify: useContext(NotificationContext)!,
  };
}

