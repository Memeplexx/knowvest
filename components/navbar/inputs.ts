import { useSession } from "next-auth/react";
import { initialState } from "./constants";
import { derive } from "olik/derive";
import { isAfter } from "date-fns";
import { useNestedStore } from "@/utils/hooks";

export const useInputs = () => {
  const store = useNestedStore(initialState)!;
  const state = store.navBar.$useState();
  const { data: session } = useSession()
  const flashCardCount = derive(store.flashCards)
    .$with(flashCards => flashCards.filter(f => !f.isArchived && isAfter(new Date(), f.nextQuestionDate)))
    .$useState().length;

  return {
    store,
    ...state,
    session,
    flashCardCount,
  }
}