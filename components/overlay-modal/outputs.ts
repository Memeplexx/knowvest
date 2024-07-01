import { Props } from "./constants";

export const useOutputs = (props: Props) => {
  return {
    onClickBackdrop: () => {
      props.onBackdropClick?.();
    },
  };
};