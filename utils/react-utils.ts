import { ForwardedRef, forwardRef, ComponentType } from "react";

export const createComponent = <Props, Inputs extends object, Outputs extends object, Handle>(
  useInputs: (props: Props, forwardedRef: ForwardedRef<Handle>) => Inputs,
  useOutputs: (inputs: Inputs) => Outputs,
  render: (props: Props, inputs: Inputs, outputs: Outputs, forwardedRef: ForwardedRef<Handle>) => JSX.Element
) => {
  const Component = (
    props: Props,
    forwardedRef: ForwardedRef<Handle>
  ) => {
    const inputs = useInputs(props, forwardedRef);
    const outputs = useOutputs(inputs);
    return render(props, inputs, outputs, forwardedRef);
  }
  return forwardRef(Component) as ComponentType<Props>;
}