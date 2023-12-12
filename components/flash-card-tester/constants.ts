import { FlashCardDTO } from "@/server/dtos";
import { useInputs } from "./inputs";

export type Props = {
  onHide: () => void,
};

export const initialState = {
  flashCard: {
    showOptions: false,
    showSearchDialog: false,
    showFlashCardsDialog: false,
    flashCardCount: 0,
    items: new Array<FlashCardDTO>(),
  }
};

export type Inputs = ReturnType<typeof useInputs>;