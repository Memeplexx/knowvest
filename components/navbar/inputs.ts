import { useSession } from "next-auth/react";
import { initialState } from "./constants";
import { isAfter } from "date-fns";
import { useStore } from "@/utils/hooks";
import { useMemo } from "react";

export const useInputs = () => {
  
  const { store, navBar, flashCards } = useStore(initialState);
  const { data: session } = useSession();
  const flashCardCount = useMemo(() => {
    return flashCards.filter(f => !f.isArchived && isAfter(new Date(), f.nextQuestionDate)).length;
  }, [flashCards]);

  return {
    store,
    ...navBar,
    session,
    flashCardCount,
  }
}