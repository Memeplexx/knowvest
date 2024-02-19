import { FlashCardId } from "@/actions/types";
import { useInputs } from "./inputs";

export const initialState = {
  activeFlashCards: {
    confirmDeleteId: null as null | FlashCardId,
  }
}

export type Inputs = ReturnType<typeof useInputs>;
