import { Store } from "olik";
import { useInputs } from "./inputs";


export const initialState = {
  historyExpanded: false,
  similarExpanded: false,
  tagsExpanded: false,
  headerExpanded: true,
  selectedTab: 'Tags',
  status: 'pristine' as 'pristine' | 'loggingOut' | 'initializingData' | 'dataInitialized' | 'complete',
};

export type HomeStore = Store<typeof initialState>;

export type Inputs = ReturnType<typeof useInputs>;
