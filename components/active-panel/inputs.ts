import { useComponentDownloader, useNestedStore } from '@/utils/hooks';
import { NotificationContext } from '@/utils/pages/home/constants';
import { useContext } from 'react';
import { initialState, tag } from './constants';
import { derivations } from '@/utils/derivations';



export const useInputs = () => {

  const { store, state } = useNestedStore(tag, initialState);
  const mayDeleteNote = derivations.activeNotesSortedByDateViewed(store).$useState().length > 1;
  const activeNoteId = store.activeNoteId.$useState();
  const editor = useComponentDownloader(() => import('../active-editor'));
  
  return {
    store,
    ...state,
    activeNoteId,
    editor,
    mayDeleteNote,
    notify: useContext(NotificationContext)!,
  };
}

