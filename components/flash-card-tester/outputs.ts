import { answerFlashCardQuestionCorrectly, answerFlashCardQuestionIncorrectly } from "@/actions/flashcard";
import { useEventHandlerForDocument } from "@/utils/dom-utils";
import { writeToStoreAndDb } from "@/utils/storage-utils";
import { Inputs, Props } from "./constants";

export const useOutputs = (props: Props, inputs: Inputs) => {
  const { store, local, notify, bodyRef, items } = inputs;
  return {
    onClickDocument: useEventHandlerForDocument('click', event => {
      if (event.target.parentNode === null) // element was removed from the DOM
        return;
      if (event.target.hasAncestorWithTagNames('BUTTON', 'INPUT'))
        return;
      if (bodyRef.current?.contains(event.target))
        return;
      props.onHide();
    }),
    onToggleView: () => {
      local.showQuestions.$toggle();
    },
    onClickWrongAnswer: async () => {
      const flashCardId = items[0]!.id;
      const apiResponse = await answerFlashCardQuestionIncorrectly(flashCardId);
      await writeToStoreAndDb(store, { flashCards: apiResponse.flashCard });
      notify.success('Better luck next time...');
    },
    onClickRightAnswer: async () => {
      const flashCardId = items[0]!.id;
      const apiResponse = await answerFlashCardQuestionCorrectly(flashCardId);
      await writeToStoreAndDb(store, { flashCards: apiResponse.flashCard });
      notify.success('Nice one!');
    },
  };
}