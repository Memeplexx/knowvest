import { MediaQueries, useResizeListener } from "./dom-utils";
import { AppStore } from "./store-utils";

export const useHeaderResizer = (store: AppStore) => {
  useResizeListener(() => {
    if (window.innerWidth >= MediaQueries.md && !store.$state.headerExpanded)
      store.headerExpanded.$set(true);
    else if (window.innerWidth < MediaQueries.md && store.$state.headerExpanded)
      store.headerExpanded.$set(false);
  });
}
