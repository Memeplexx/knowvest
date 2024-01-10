import { useSession } from "next-auth/react";
import { initialState } from "./constants";
import { isAfter } from "date-fns";
import { useNestedStore } from "@/utils/hooks";
import { useMemo } from "react";

export const useInputs = () => {
  const { store, state } = useNestedStore('navBar', initialState);
  const { data: session } = useSession();
  const flashCards = store.flashCards.$useState();
  const flashCardCount = useMemo(() => {
    return flashCards.filter(f => !f.isArchived && isAfter(new Date(), f.nextQuestionDate)).length;
  }, [flashCards]);

  return {
    store,
    ...state,
    session,
    flashCardCount,
  }
}