import { Props } from "./constants"
import { useInputs } from "./inputs"
import { useOutputs } from "./outputs";
import { Container } from "./styles"

export const FlashCardTester = (props: Props) => {
  const inputs = useInputs(props);
  const outputs = useOutputs(inputs);
  return (
    <Container
      ref={inputs.bodyRef}
      children={
        'hello'
      }
    />

  )
}