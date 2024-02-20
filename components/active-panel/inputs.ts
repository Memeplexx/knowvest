import { useStore } from '@/utils/store-utils';
import { useMemo, useRef } from 'react';
import { useNotifier } from '../notifier';
import { PopupHandle } from '../popup/constants';
import { initialState } from './constants';
import { useComponentDownloader } from '@/utils/react-utils';


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

