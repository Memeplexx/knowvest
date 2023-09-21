import { NotificationContext } from '@/utils/pages/home/constants';
import { store } from '@/utils/store';
import { useFloating } from '@floating-ui/react';
import dynamic from 'next/dynamic';
import { derive } from 'olik/derive';
import { useContext, useMemo, useState } from 'react';



export const useInputs = () => {

  const floating = useFloating<HTMLButtonElement>({ placement: 'bottom-end' });

  const mayDeleteNote = derive(store.notes).$with(notes => notes.length > 1);

  const state = store.activePanel.$useState();

  const [loadingEditor, setLoadingEditor] = useState(true);
  const ActiveEditor = useMemo(() => {
    return dynamic(() => import('../active-editor').finally(() => setLoadingEditor(false)));
  }, []);

  return {
    refs: {
      floating,
    },
    state: {
      ...state,
      loadingEditor,
      mayDeleteNote: mayDeleteNote.$useState(),
    },
    notify: useContext(NotificationContext)!,
    ActiveEditor,
  };
}

