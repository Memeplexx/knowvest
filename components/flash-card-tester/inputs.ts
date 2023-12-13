import { useContext, useEffect, useMemo, useRef } from "react";
import { Props, initialState } from "./constants";
import { useContextForNestedStore } from "@/utils/constants";
import { trpc } from "@/utils/trpc";
import { NotificationContext } from "@/utils/pages/home/constants";

export const useInputs = (props: Props) => {

  const store = useContextForNestedStore(initialState)!;
  const state = store.flashCard.$useState();
  const notify = useContext(NotificationContext)!;

  useEffect(() => {
    const fetchCards = () => trpc.flashCard.listForTest.query()
      .then(result => store.flashCard.items.$push(result.flashCards));
    const timeout = setTimeout(() => fetchCards(), 1000 * 60);
    fetchCards();
    return () => clearTimeout(timeout);
  }, []);

  return {
    ...state,
    notify,
    store,
    props,
    bodyRef: useRef<HTMLDivElement>(null),
  }
}