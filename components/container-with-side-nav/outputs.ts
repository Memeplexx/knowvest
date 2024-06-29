import { Inputs, Props } from "./constants";

export const useOutputs = (props: Props, inputs: Inputs) => ({
  onClickMainOverlay: () => {
    inputs.api.start({ x: 0, y: 0 });
    props.onShow(false);
  }
})