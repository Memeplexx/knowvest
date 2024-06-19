import { useLocalStore, useStore } from "@/utils/store-utils";
import { isAfter } from "date-fns";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { addToWhitelist } from "olik/devtools";
import { useMemo, useRef } from "react";
import { initialState } from "./constants";

export const useInputs = () => {

  const { store, state: { flashCards, mediaQuery } } = useStore();
  const { local } = useLocalStore('navBar', initialState);
  useMemo(() => addToWhitelist([store.showLoader]), [store]);
  const routerPathName = usePathname()!;
  const previousRoutePath = useRef(routerPathName);
  if (previousRoutePath.current !== routerPathName) {
    previousRoutePath.current = routerPathName;
    store.showLoader.$set(false);
  }
  const pageTitle = useMemo(() => {
    const narrow = mediaQuery === 'md' || mediaQuery === 'sm' || mediaQuery === 'xs';
    switch (routerPathName) {
      case '/app/home':
        return 'Home';
      case '/app/tags':
        return narrow ? 'Tags' : 'Configure Tags';
      case '/app/search':
        return narrow ? 'Search' : 'Search for Notes';
      case '/app/test':
        return narrow ? 'Test' : 'Flash Card Tester';
      default:
        return 'Unknown';
    }
  }, [routerPathName, mediaQuery]);

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