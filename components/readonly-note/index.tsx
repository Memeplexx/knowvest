import { Props } from './constants';
import { useInputs } from './inputs';
import { Wrapper } from './styles';

export default function ReadonlyNote(
  props: Props
) {
  const inputs = useInputs(props);
  const { refs } = inputs;
  return (
    <Wrapper
      {...props}
      ref={refs.editor}
    />
  );
}

