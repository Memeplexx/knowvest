import { Store } from "olik";
import { useInputs } from "./inputs";


export const initialState = {
  historyExpanded: false,
  similarExpanded: false,
  tagsExpanded: false,
  headerExpanded: true,
  selectedTab: 'Tags',
  // status: 'pristine' as 'pristine' | 'loggingOut' | 'initializingData' | 'dataInitialized' | 'initializingWorker' | 'complete',
  isPristine: true,
  isLoggingOut: false,
  isInitializingData: false,
  isDataInitialized: false,
  isInitializingWorker: false,
  isComplete: false,
};

export type HomeStore = Store<typeof initialState>;

export type Inputs = ReturnType<typeof useInputs>;
