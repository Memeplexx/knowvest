import { StoreContext } from "@/utils/constants";
import { useSession } from "next-auth/react";
import { useContext } from "react";

export const useInputs = () => {

  const store = useContext(StoreContext)!;

  const state = store.navBar.$useState();

  const { data: session } = useSession()

  return {
    store,
    state: {
      ...state,
      session,
    },
  }
}