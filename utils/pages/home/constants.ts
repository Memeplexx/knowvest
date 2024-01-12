import { useInputs } from "./inputs";
import { Store } from "olik";
import { AppState } from "@/utils/constants";


export const initialState = {
  home: {
    historyExpanded: false,
    similarExpanded: false,
    tagsExpanded: false,
    headerExpanded: true,
  }
};

export type HomeStore = Store<AppState & typeof initialState>;

export type State = ReturnType<typeof useInputs>;
