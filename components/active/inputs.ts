import { StoreContext } from '@/utils/constants';
import { useIsMounted } from '@/utils/hooks';
import { NotificationContext } from '@/utils/pages/home/constants';
import dynamic from 'next/dynamic';
import { derive } from 'olik/derive';
import { useContext, useMemo, useState } from 'react';



export const useInputs = () => {

  const store = useContext(StoreContext)!;

  const mayDeleteNote = derive(store.notes).$with(notes => notes.length > 1);

  const state = store.activePanel.$useState();

  const activeNoteId = store.activeNoteId.$useState();

  const isMounted = useIsMounted();
  const [loadingEditor, setLoadingEditor] = useState(true);
  const ActiveEditor = useMemo(() => {
    if (!isMounted) { return null; }
    return dynamic(() => import('../active-editor').finally(() => setLoadingEditor(false)));
  }, [isMounted]);

  return {
    store,
    state: {
      ...state,
      activeNoteId,
      loadingEditor,
      mayDeleteNote: mayDeleteNote.$useState(),
    },
    notify: useContext(NotificationContext)!,
    ActiveEditor,
  };
}

