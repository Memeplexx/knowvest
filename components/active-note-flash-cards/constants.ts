import { FlashCardId } from "@/server/dtos";
import { useInputs } from "./inputs";

export const initialState = {
  confirmDeleteId: null as null | FlashCardId,
}

export type Inputs = ReturnType<typeof useInputs>;
