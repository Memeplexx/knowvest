import { store, useLocalStore, useStore } from "@/utils/store-utils";
import { isAfter } from "date-fns";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { addToWhitelist } from "olik/devtools";
import { useMemo } from "react";
import { initialState } from "./constants";

export const useInputs = () => {

  const { flashCards, isMobileWidth } = useStore();
  const { local, state } = useLocalStore('navBar', initialState);
  useMemo(() => addToWhitelist([store.showLoader]), []);
  const routerPathName = usePathname()!;
  const session = useSession().data;
  const flashCardCount = useMemo(() => {
    return flashCards.filter(f => isAfter(new Date(), f.nextQuestionDate)).length;
  }, [flashCards])
  const pageTitle = useMemo(() => {
    switch (routerPathName) {
      case '/app/home':
        return 'Home';
      case '/app/history':
        return 'Previous Notes';
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
    ...state,
    pageTitle,
    local,
    routerPathName,
    session,
    flashCardCount,
    isMobileWidth,
  }
}