import { Props } from './constants';
import { useInputs } from './inputs';
import { Wrapper } from './styles';

export default function ReadonlyNote(
  props: Props
) {
  const inputs = useInputs(props);
  const { refs } = inputs;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { note, synonymIds, ...remainingProps } = props;
  return (
    <Wrapper
      {...remainingProps}
      ref={refs.editor}
    />
  );
}

