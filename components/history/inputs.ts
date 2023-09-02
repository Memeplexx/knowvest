import { useEffect, useMemo, useState } from "react";
import { Props } from "./constants";
import { store } from "@/utils/store";
import dynamic from "next/dynamic";

export const useInputs = (props: Props) => {

  const state = store.historyPanel.$useState();
  const [initialized, setInitialized] = useState(false);
  useEffect(() => setInitialized(true), [])

  const [loadingHistoricalNotes, setLoadingHistoricalNotes] = useState(true);
  const HistoricalNotes = useMemo(() => {
    return dynamic(() => import('../history-items').finally(() => setLoadingHistoricalNotes(false)));
  }, []);

  return {
    props,
    state: {
      ...state,
      loadingHistoricalNotes,
      initialized
    },
    HistoricalNotes,
  };
}
