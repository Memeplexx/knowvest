"use client";
import { Props } from './constants';
import { useInputs } from './inputs';
import { Wrapper } from './styles';

export default function ReadonlyNote(
  props: Props
) {
  const inputs = useInputs(props);
  const htmlProps = Object.keysTyped(props).filter(key => key !== 'note' && key !== 'synonymIds').mapToObject(k => k, k => props[k]);
  return (
    <Wrapper
      {...htmlProps}
      ref={inputs.editorRef}
    />
  );
}

