import { Store } from "olik";
import { useInputs } from "./inputs";


export const initialState = {
  historyExpanded: false,
  similarExpanded: false,
  tagsExpanded: false,
  headerExpanded: true,
  selectedTab: 'Tags',
  stage: 'pristine' as 'pristine' | 'initializeData' | 'fetchingNoteTags' | 'done',
};

export type HomeStore = Store<typeof initialState>;

export type Inputs = ReturnType<typeof useInputs>;
