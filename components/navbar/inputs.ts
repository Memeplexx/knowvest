import { useLocalStore, useStore } from "@/utils/store-utils";
import { isAfter } from "date-fns";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { addToWhitelist } from "olik/devtools";
import { useMemo, useRef } from "react";
import { initialState } from "./constants";

export const useInputs = () => {

  const { store, state: { flashCards } } = useStore();
  const { local } = useLocalStore('navBar', initialState);
  useMemo(() => addToWhitelist([store.showLoader]), [store]);
  const routerPathName = usePathname()!;
  const previousRoutePath = useRef(routerPathName);
  if (previousRoutePath.current !== routerPathName) {
    previousRoutePath.current = routerPathName;
    store.showLoader.$set(false);
  }
  const pageTitle = useMemo(() => {
    switch (routerPathName) {
      case '/app/home':
        return 'Home';
      case '/app/tags':
        return 'Configure Tags';
      case '/app/search':
        return 'Search for Notes';
      case '/app/test':
        return 'Flash Card Tester';
      default:
        return 'Unknown';
    }
  }, [routerPathName]);

  return {
    ...local.$state,
    pageTitle,
    store,
    local,
    routerPatchName: routerPathName,
    session: useSession().data,
    flashCardCount: useMemo(() => flashCards.filter(f => isAfter(new Date(), f.nextQuestionDate)).length, [flashCards]),
  }
}