import { useStore } from '@/utils/store-utils';
import { useMemo, useRef } from 'react';
import { useNotifier } from '../notifier';
import { PopupHandle } from '../popup/constants';
import { initialState } from './constants';


export const useInputs = () => {

  const { store, activePanel, activeNoteId, notes, stateInitialized } = useStore(initialState);
  const popupRef = useRef<PopupHandle>(null);
  const notify = useNotifier();
  const mayDeleteNote = useMemo(() => {
    return notes.length > 1;
  }, [notes]);
  
  return {
    store,
    activePanel,
    activeNoteId,
    mayDeleteNote,
    popupRef,
    notify,
    stateInitialized,
  };
}

