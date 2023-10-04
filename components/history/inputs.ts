import { useContext, useMemo, useRef, useState } from "react";
import { Props } from "./constants";
import dynamic from "next/dynamic";
import { CardHandle } from "../card/constants";
import { StoreContext } from "@/utils/constants";
import { useIsMounted } from "@/utils/hooks";


export const useInputs = (props: Props) => {

  const store = useContext(StoreContext)!;

  const [loading, setLoading] = useState(true);
  const isMounted = useIsMounted();
  const HistoricalNotes = useMemo(() => {
    if (!isMounted) { return null; }
    return dynamic(() => import('../history-items').finally(() => setLoading(false)));
  }, [isMounted]);

  return {
    props,
    store,
    refs: {
      card: useRef<CardHandle>(null),
    },
    state: {
      loading,
    },
    HistoricalNotes,
  };
}
