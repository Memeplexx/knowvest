import { ancestorMatches } from "@/utils/functions";
import { Inputs } from "./constants";
import { useEventHandlerForDocument } from "@/utils/hooks";
import { trpc } from "@/utils/trpc";

export const useOutputs = (inputs: Inputs) => {
  const { props, store } = inputs;
  return {
    onClickDocument: useEventHandlerForDocument('click', event => {
      if ((event.target as HTMLElement).parentNode === null) { // element was removed from the DOM
        return;
      }
      if (ancestorMatches(event.target, e => ['BUTTON', 'INPUT'].includes(e.tagName))) {
        return;
      }
      if (inputs.bodyRef.current?.contains(event.target as HTMLElement)) {
        return;
      }
      props.onHide();
    }),
    onToggleView: () => {
      store.flashCard.showQuestions.$toggle();
    },
    onClickWrongAnswer: async () => {
      const id = inputs.items[0].id;
      await trpc.flashCard.answerQuestionIncorrectly.mutate({ id });
      inputs.store.flashCard.items.$find.id.$eq(id).$delete();
      inputs.notify.success('Better luck next time...');
    },
    onClickRightAnswer: async () => {
      const id = inputs.items[0].id;
      await trpc.flashCard.answerQuestionCorrectly.mutate({ id });
      inputs.store.flashCard.items.$find.id.$eq(id).$delete();
      inputs.notify.success('Nice one!');
    },
  };
}