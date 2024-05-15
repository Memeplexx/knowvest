import { useInputs } from "./inputs";
import { Store } from "olik";
import { AppState } from "@/utils/store-utils";


export const initialState = {
  home: {
    historyExpanded: false,
    similarExpanded: false,
    tagsExpanded: false,
    headerExpanded: true,
    selectedTab: 'Tags',
  }
};

export type HomeStore = Store<AppState & typeof initialState>;

export type State = ReturnType<typeof useInputs>;
