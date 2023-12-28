import { Store } from "olik";
import { useInputs } from "./inputs";
import { AppState } from "@/utils/constants";
import { initialState } from "../active-panel/constants";

export type Inputs = ReturnType<typeof useInputs>;

export type ActivePanelStore = Store<AppState & { activePanel: typeof initialState }>;
