import { useEffect, useRef } from "react";
import { Props, initialState } from "./constants";
import { useContextForNestedStore } from "@/utils/constants";
import { trpc } from "@/utils/trpc";

export const useInputs = (props: Props) => {

  const store = useContextForNestedStore(initialState)!;
  const state = store.flashCard.$useState();

  useEffect(() => {
    const timeout = setTimeout(() => {
      trpc.flashCard.listForTest.query()
        .then(result => store.flashCard.items.$set(result.flashCards));
    }, 1000 * 60);
    return () => clearTimeout(timeout);
  }, []);

  return {
    ...state,
    store,
    props,
    bodyRef: useRef<HTMLDivElement>(null),
  }
}