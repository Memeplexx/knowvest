import { useLocalStore, useStore } from "@/utils/store-utils";
import { isAfter } from "date-fns";
import { useSession } from "next-auth/react";
import { useMemo } from "react";
import { initialState } from "./constants";

export const useInputs = () => {

  const { state: { flashCards, stateInitialized } } = useStore();
  const { local } = useLocalStore('navBar', initialState);

  return {
    ...local.$state,
    local,
    stateInitialized,
    session: useSession().data,
    flashCardCount: useMemo(() => flashCards.filter(f => isAfter(new Date(), f.nextQuestionDate)).length, [flashCards]),
  }
}