import { useEffect, useMemo, useState } from "react";
import { Props } from "./constants";
import dynamic from "next/dynamic";

export const useInputs = (props: Props) => {

  const [initialized, setInitialized] = useState(false);
  useEffect(() => setInitialized(true), [])

  const [loadingHistoricalNotes, setLoadingHistoricalNotes] = useState(true);
  const HistoricalNotes = useMemo(() => {
    return dynamic(() => import('../history-items').finally(() => setLoadingHistoricalNotes(false)));
  }, []);

  return {
    props,
    state: {
      loadingHistoricalNotes,
      initialized
    },
    HistoricalNotes,
  };
}
