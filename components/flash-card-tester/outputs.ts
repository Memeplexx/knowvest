import { answerFlashCardQuestionCorrectly, answerFlashCardQuestionIncorrectly } from "@/actions/flashcard";
import { ancestorMatches, useEventHandlerForDocument } from "@/utils/dom-utils";
import { writeToStoreAndDb } from "@/utils/storage-utils";
import { Inputs } from "./constants";

export const useOutputs = (inputs: Inputs) => {
  const { props, store, notify, bodyRef, items } = inputs;
  return {
    onClickDocument: useEventHandlerForDocument('click', event => {
      if ((event.target as HTMLElement).parentNode === null) { // element was removed from the DOM
        return;
      }
      if (ancestorMatches(event.target, e => ['BUTTON', 'INPUT'].includes(e.tagName))) {
        return;
      }
      if (bodyRef.current?.contains(event.target as HTMLElement)) {
        return;
      }
      props.onHide();
    }),
    onToggleView: () => {
      store.flashCardTester.showQuestions.$toggle();
    },
    onClickWrongAnswer: async () => {
      const id = items[0].id;
      const apiResponse = await answerFlashCardQuestionIncorrectly({ id });
      await writeToStoreAndDb(store, { flashCards: apiResponse.flashCard });
      notify.success('Better luck next time...');
    },
    onClickRightAnswer: async () => {
      const id = items[0].id;
      const apiResponse = await answerFlashCardQuestionCorrectly({ id });
      await writeToStoreAndDb(store, { flashCards: apiResponse.flashCard });
      notify.success('Nice one!');
    },
  };
}