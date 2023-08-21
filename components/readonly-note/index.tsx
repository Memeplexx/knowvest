import { Props } from './constants';
import { useHooks } from './hooks';
import { Wrapper } from './styles';

export default function ReadonlyNote(
  props: Props
) {
  const state = useHooks(props);
  return (
    <Wrapper
      {...props}
      ref={state.editorDomElement}
    />
  );
}

