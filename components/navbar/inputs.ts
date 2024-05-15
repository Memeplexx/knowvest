import { useStore } from "@/utils/store-utils";
import { isAfter } from "date-fns";
import { useSession } from "next-auth/react";
import { useMemo } from "react";
import { initialState } from "./constants";

export const useInputs = () => {
  
  const { localState, localStore, flashCards, stateInitialized } = useStore({ key: 'navBar', value: initialState.navBar });
  const { data: session } = useSession();
  const flashCardCount = useMemo(() => {
    return flashCards.filter(f => isAfter(new Date(), f.nextQuestionDate)).length;
  }, [flashCards]);

  return {
    ...localState,
    localStore,
    session,
    flashCardCount,
    stateInitialized,
  }
}