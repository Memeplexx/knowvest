import { store } from "@/utils/store";
import { useFloating } from "@floating-ui/react"
import { useSession } from "next-auth/react"

export const useHooks = () => {

  const state = store.navBar.$useState();

  const { data: session } = useSession()

  const floating = useFloating<HTMLElement>({ placement: 'bottom-end' })

  return {
    state: {
      ...state,
      session,
    },
    refs: {
      floating
    },
  }
}