import { useInputs } from "./inputs";
import { StoreDef } from "olik";


export const initialState = {
  historyExpanded: false,
  similarExpanded: false,
  tagsExpanded: false,
  headerExpanded: true,
  selectedTab: 'Tags',
};

export type HomeStore = StoreDef<typeof initialState>;

export type Inputs = ReturnType<typeof useInputs>;
