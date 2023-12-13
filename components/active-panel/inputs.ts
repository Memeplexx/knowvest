import { useContextForNestedStore } from '@/utils/constants';
import { useIsMounted } from '@/utils/hooks';
import { NotificationContext } from '@/utils/pages/home/constants';
import dynamic from 'next/dynamic';
import { useContext, useMemo, useState } from 'react';
import { initialState } from './constants';



export const useInputs = () => {
  const store = useContextForNestedStore(initialState)!;
  const state = store.activePanel.$useState();
  const mayDeleteNote = store.notes.$useState().length > 1;
  const activeNoteId = store.activeNoteId.$useState();
  const isMounted = useIsMounted();
  const [loadingEditor, setLoadingEditor] = useState(true);
  const ActiveEditor = useMemo(() => {
    if (!isMounted) { return null; }
    return dynamic(() => import('../active-editor').finally(() => setLoadingEditor(false)));
  }, [isMounted]);
  return {
    ...state,
    store,
    activeNoteId,
    loadingEditor,
    mayDeleteNote,
    notify: useContext(NotificationContext)!,
    ActiveEditor,
  };
}

