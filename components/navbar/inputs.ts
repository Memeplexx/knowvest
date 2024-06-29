import { useLocalStore, useStore } from "@/utils/store-utils";
import { isAfter } from "date-fns";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { addToWhitelist } from "olik/devtools";
import { useMemo } from "react";
import { initialState } from "./constants";

export const useInputs = () => {

  const { store, state: { flashCards, isMobileWidth } } = useStore();
  const { local } = useLocalStore('navBar', initialState);
  useMemo(() => addToWhitelist([store.showLoader]), [store]);
  const routerPathName = usePathname()!;
  const pageTitle = useMemo(() => {
    switch (routerPathName) {
      case '/app/home':
        return 'Home';
      case '/app/history':
        return 'Historical Notes';
      case '/app/related':
        return 'Related Notes';
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
    isMobileWidth,
  }
}