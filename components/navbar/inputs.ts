import { useLocalStore, useStore } from "@/utils/store-utils";
import { isAfter } from "date-fns";
import { useSession } from "next-auth/react";
import { useMemo } from "react";
import { initialState } from "./constants";

export const useInputs = () => {
  
  const { state: { flashCards, stateInitialized } } = useStore();
  const { local } = useLocalStore('navBar', initialState);
  const { data: session } = useSession();
  const flashCardCount = useMemo(() => {
    return flashCards.filter(f => isAfter(new Date(), f.nextQuestionDate)).length;
  }, [flashCards]);

  return {
    ...local.$state,
    local,
    session,
    flashCardCount,
    stateInitialized,
  }
}