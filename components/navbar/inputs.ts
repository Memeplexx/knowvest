import { useLocalStore, useStore } from "@/utils/store-utils";
import { isAfter } from "date-fns";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useMemo, useRef } from "react";
import { initialState } from "./constants";

export const useInputs = () => {

  const { store, state: { flashCards } } = useStore();
  const { local } = useLocalStore('navBar', initialState);
  const routerPatchName = usePathname()!;
  const previousRoutePath = useRef(routerPatchName);
  if (previousRoutePath.current !== routerPatchName) {
    previousRoutePath.current = routerPatchName;
    store.showLoader.$set(false);
  }

  return {
    ...local.$state,
    store,
    local,
    routerPatchName,
    session: useSession().data,
    flashCardCount: useMemo(() => flashCards.filter(f => isAfter(new Date(), f.nextQuestionDate)).length, [flashCards]),
  }
}