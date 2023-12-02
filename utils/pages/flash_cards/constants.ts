import { FlashCardId, type FlashCardDTO } from "@/server/dtos";
import { useInputs } from "./inputs";


export const flashCardInitialState = {
  confirmDeleteFlashCardId: null as null | FlashCardId,
};

export type ServerSideProps = {
  flashCards: FlashCardDTO[],
}

export type State = ReturnType<typeof useInputs>;

