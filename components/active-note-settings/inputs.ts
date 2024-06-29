import { useLocalStore, useStore } from '@/utils/store-utils';
import { useRef } from 'react';
import { useNotifier } from '../notifier';
import { PopupHandle } from '../popup/constants';
import { initialState } from './constants';


export const useInputs = () => {

  const { store, state: { notes } } = useStore();
  const { local, state } = useLocalStore('activePanelSettings', initialState);
  const notify = useNotifier();
  const popupRef = useRef<PopupHandle>(null);
  return {
    store,
    local,
    notify,
    ...state,
    mayDeleteNote: !!notes.length,
    popupRef,
  };
}
