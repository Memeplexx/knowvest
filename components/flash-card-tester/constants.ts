import { useInputs } from "./inputs";

export type Props = {
  onHide: () => void,
};

export const initialState = {
  flashCardTester: {
    showOptions: false,
    showSearchDialog: false,
    showFlashCardsDialog: false,
    showQuestions: true,
  }
};

export type Inputs = ReturnType<typeof useInputs>;