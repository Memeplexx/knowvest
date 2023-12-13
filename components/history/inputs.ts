import { useContextForNestedStore } from "@/utils/constants";
import { useIsMounted } from "@/utils/hooks";
import dynamic from "next/dynamic";
import { useMemo, useRef } from "react";
import { CardHandle } from "../card/constants";
import { Props, initialState } from "./constants";


export const useInputs = (props: Props) => {

  const store = useContextForNestedStore(initialState)!;
  const state = store.history.$useState();

  const isMounted = useIsMounted();
  const HistoricalNotes = useMemo(() => {
    if (!isMounted) { return null; }
    return dynamic(() => import('../history-items').finally(() => store.history.loading.$set(false)));
  }, [isMounted]);

  return {
    props,
    store,
    cardRef: useRef<CardHandle>(null),
    ...state,
    HistoricalNotes,
  };
}
