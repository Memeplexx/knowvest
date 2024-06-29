import { useLocalStore, useStore } from '@/utils/store-utils';
import { useRef } from 'react';
import { useNotifier } from '../notifier';
import { PopupHandle } from '../popup/constants';
import { initialState } from './constants';


export const useInputs = () => {

  const { notes } = useStore();
  const { local, state } = useLocalStore('activePanelSettings', initialState);
  const notify = useNotifier();
  const popupRef = useRef<PopupHandle>(null);
  return {
    local,
    notify,
    ...state,
    mayDeleteNote: !!notes.length,
    popupRef,
  };
}
