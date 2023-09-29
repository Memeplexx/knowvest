import { store } from "@/utils/store";
import { useSession } from "next-auth/react";

export const useInputs = () => {

  const state = store.navBar.$useState();

  const { data: session } = useSession()

  return {
    state: {
      ...state,
      session,
    },
  }
}