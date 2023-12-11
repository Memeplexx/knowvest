import { FlashCardDTO, FlashCardId } from "@/server/dtos";
import { useInputs } from "./inputs";

export const initialState = {
  flashCards: {
    items: new Array<FlashCardDTO>(),
    confirmDeleteId: null as null | FlashCardId,
    focusId: null as null | FlashCardId,
  }
}

export type Inputs = ReturnType<typeof useInputs>;
