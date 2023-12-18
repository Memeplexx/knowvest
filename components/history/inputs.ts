import { useIsMounted, useNestedStore } from "@/utils/hooks";
import dynamic from "next/dynamic";
import { useMemo, useRef } from "react";
import { CardHandle } from "../card/constants";
import { Props, initialState } from "./constants";


export const useInputs = (props: Props) => {

  const store = useNestedStore(initialState)!;
  const state = store.history.$useState();
  const isMounted = useIsMounted();
  const HistoricalNotes = useMemo(() => {
    if (!isMounted) { return null; }
    return dynamic(() => import('../history-items').finally(() => store.history.loading.$set(false)));
  }, [isMounted, store]);

  return {
    props,
    store,
    cardRef: useRef<CardHandle>(null),
    ...state,
    HistoricalNotes,
  };
}
