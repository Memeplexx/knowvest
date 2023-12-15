import { useContextForNestedStore } from "@/utils/constants";
import { useSession } from "next-auth/react";
import { initialState } from "./constants";
import { derive } from "olik/derive";
import { isBefore } from "date-fns";

export const useInputs = () => {
  const store = useContextForNestedStore(initialState)!;
  // const flashCardCount = store.flashCards.$useState().length;
  const state = store.navBar.$useState();
  const { data: session } = useSession()

  const flashCardCount = derive(store.flashCards)
    .$with(flashCards => flashCards.filter(f => isBefore(new Date(), f.nextQuestionDate)).length)
    .$useState();

  return {
    store,
    ...state,
    session,
    flashCardCount,
  }
}