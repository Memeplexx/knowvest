import { Props } from './constants';
import { useInputs } from './inputs';
import { Wrapper } from './styles';

export default function ReadonlyNote(
  props: Props
) {
  const inputs = useInputs(props);
  const { showIf, className } = props;
  return (
    <Wrapper
      showIf={showIf}
      className={className}
      ref={inputs.editorRef}
    />
  );
}

