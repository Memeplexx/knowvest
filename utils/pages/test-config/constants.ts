import { QuestionDTO } from "@/server/dtos";
import { useInputs } from "./inputs";


export const initialState = {
};

export type ServerSideProps = {
  questions: QuestionDTO[],
}

export type State = ReturnType<typeof useInputs>;

