import { FlashCardDTO, FlashCardId } from "@/server/dtos";
import { useInputs } from "./inputs";

export const initialState = {
  flashCards: {
    items: new Array<FlashCardDTO>(),
    confirmDeleteId: null as null | FlashCardId,
    loading: true,
  }
}

export type Inputs = ReturnType<typeof useInputs>;
