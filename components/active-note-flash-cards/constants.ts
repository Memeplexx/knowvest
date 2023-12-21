import { FlashCardId } from "@/server/dtos";
import { useInputs } from "./inputs";

export const initialState = {
  activeFlashCards: {
    confirmDeleteId: null as null | FlashCardId,
  }
}

export const tag = 'activeNoteFlashCardsComponent';

export type Inputs = ReturnType<typeof useInputs>;