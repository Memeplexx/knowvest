import { answerFlashCardQuestionCorrectly, answerFlashCardQuestionIncorrectly } from "@/actions/flashcard";
import { Inputs } from "./constants";

export const useOutputs = (inputs: Inputs) => {
  const { local, notify, items, store } = inputs;
  return {
    onToggleView: () => {
      local.showQuestions.$toggle();
    },
    onClickWrongAnswer: async () => {
      const flashCardId = items[0]!.id;
      const apiResponse = await answerFlashCardQuestionIncorrectly(flashCardId);
      store.flashCards.$mergeMatching.id.$with(apiResponse.flashCard);
      notify.success('Better luck next time...');
    },
    onClickRightAnswer: async () => {
      const flashCardId = items[0]!.id;
      const apiResponse = await answerFlashCardQuestionCorrectly(flashCardId);
      store.flashCards.$mergeMatching.id.$with(apiResponse.flashCard);
      notify.success('Nice one!');
    },
  };
}