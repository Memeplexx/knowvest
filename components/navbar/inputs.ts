import { useStore } from "@/utils/store-utils";
import { isAfter } from "date-fns";
import { useSession } from "next-auth/react";
import { useMemo } from "react";
import { initialState } from "./constants";

export const useInputs = () => {
  
  const { store, navBar, flashCards, stateInitialized } = useStore(initialState);
  const { data: session } = useSession();
  const flashCardCount = useMemo(() => {
    return flashCards.filter(f => !f.isArchived && isAfter(new Date(), f.nextQuestionDate)).length;
  }, [flashCards]);

  return {
    store,
    ...navBar,
    session,
    flashCardCount,
    stateInitialized,
  }
}