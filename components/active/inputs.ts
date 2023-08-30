import { NotificationContext } from '@/utils/pages/home/constants';
import { store } from '@/utils/store';
import { useFloating } from '@floating-ui/react';
import { derive } from 'olik';
import { useContext } from 'react';



export const useInputs = () => {

  const floating = useFloating<HTMLButtonElement>({ placement: 'bottom-end' });

  const mayDeleteNote = derive(store.notes).$with(notes => notes.length > 1);

  const state = store.activePanel.$useState();

  return {
    refs: {
      floating,
    },
    state: {
      ...state,
      mayDeleteNote: mayDeleteNote.$useState(),
    },
    notify: useContext(NotificationContext)!,
  };
}

