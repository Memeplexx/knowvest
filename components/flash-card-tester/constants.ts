import { useInputs } from "./inputs";

export type Props = {
  onHide: () => void,
};

export const initialState = {
  flashCard: {
    showOptions: false,
    showSearchDialog: false,
    showFlashCardsDialog: false,
    showQuestions: true,
  }
};

export const tag = 'flashCardTesterComponent';

export type Inputs = ReturnType<typeof useInputs>;