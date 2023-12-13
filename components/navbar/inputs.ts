import { useContextForNestedStore } from "@/utils/constants";
import { useSession } from "next-auth/react";
import { initialState } from "./constants";

export const useInputs = () => {
  const store = useContextForNestedStore(initialState)!;
  const flashCardCount = store.flashCardsForTest.$useState().length;
  const state = store.navBar.$useState();
  const { data: session } = useSession()
  return {
    store,
    ...state,
    session,
    flashCardCount,
  }
}