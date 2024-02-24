import { answerFlashCardQuestionCorrectly, answerFlashCardQuestionIncorrectly } from "@/actions/flashcard";
import { useEventHandlerForDocument } from "@/utils/dom-utils";
import { writeToStoreAndDb } from "@/utils/storage-utils";
import { Inputs } from "./constants";

export const useOutputs = (inputs: Inputs) => {
  const { props, store, notify, bodyRef, items } = inputs;
  return {
    onClickDocument: useEventHandlerForDocument('click', event => {
      if (event.target.parentNode === null) { // element was removed from the DOM
        return;
      }
      if (event.target.hasAncestor(e => ['BUTTON', 'INPUT'].includes(e.tagName))) {
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
      const flashCardId = items[0].id;
      const apiResponse = await answerFlashCardQuestionIncorrectly({ flashCardId });
      await writeToStoreAndDb(store, { flashCards: apiResponse.flashCard });
      notify.success('Better luck next time...');
    },
    onClickRightAnswer: async () => {
      const flashCardId = items[0].id;
      const apiResponse = await answerFlashCardQuestionCorrectly({ flashCardId });
      await writeToStoreAndDb(store, { flashCards: apiResponse.flashCard });
      notify.success('Nice one!');
    },
  };
}