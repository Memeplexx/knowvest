import { Props } from './constants';
import { useHooks } from './hooks';
import { Wrapper } from './styles';

export default function ReadonlyNote(
  props: Props
) {
  const hooks = useHooks(props);
  const { refs } = hooks;
  return (
    <Wrapper
      {...props}
      ref={refs.editor}
    />
  );
}

