import { useInputs } from "./inputs";
import { Store } from "olik";


export const initialState = {
  historyExpanded: false,
  similarExpanded: false,
  tagsExpanded: false,
  headerExpanded: true,
  selectedTab: 'Tags',
};

export type HomeStore = Store<typeof initialState>;

export type Inputs = ReturnType<typeof useInputs>;
