import { useFloating } from "@floating-ui/react"
import { useSession } from "next-auth/react"
import { useNestedStore } from "olik-react";
import { initialState } from "./constants";

export const useHooks = () => {

  const { state, store } = useNestedStore(initialState).usingAccessor(s => s.navbar);

  const { data: session } = useSession()

  const floating = useFloating<HTMLElement>({ placement: 'bottom-end' })

  return {
    session,
    floating,
    ...state,
    store,
  }
}