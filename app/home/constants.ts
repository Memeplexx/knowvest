import { ReactStoreLocal } from "olik-react";
import { useInputs } from "./inputs";
import { AppState } from "@/utils/store-utils";


export const initialState = {
  historyExpanded: false,
  similarExpanded: false,
  tagsExpanded: false,
  headerExpanded: true,
  selectedTab: 'Tags',
};

export type HomeStore = ReactStoreLocal<AppState, 'home', typeof initialState>;

export type State = ReturnType<typeof useInputs>;
