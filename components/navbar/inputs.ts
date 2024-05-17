import { useStore } from "@/utils/store-utils";
import { isAfter } from "date-fns";
import { useSession } from "next-auth/react";
import { useMemo } from "react";
import { initialState } from "./constants";

export const useInputs = () => {
  
  const { store, state } = useStore('navBar', initialState);
  const { flashCards, stateInitialized } = state;
  const { data: session } = useSession();
  const flashCardCount = useMemo(() => {
    return flashCards.filter(f => isAfter(new Date(), f.nextQuestionDate)).length;
  }, [flashCards]);

  return {
    ...state.$local,
    store,
    session,
    flashCardCount,
    stateInitialized,
  }
}