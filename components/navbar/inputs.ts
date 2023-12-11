import { StoreContext, useContextForNestedStore } from "@/utils/constants";
import { useSession } from "next-auth/react";
import { useContext } from "react";
import { initialState } from "./constants";

export const useInputs = () => {

  const store = useContextForNestedStore(initialState)!;

  const state = store.navBar.$useState();

  const { data: session } = useSession()

  return {
    store,
    ...state,
    session,
  }
}