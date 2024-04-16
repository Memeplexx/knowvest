"use client";
import { Props } from './constants';
import { useInputs } from './inputs';
import { Wrapper } from './styles';

export default function ReadonlyNote(
  props: Props
) {
  const inputs = useInputs(props);
  return (
    <Wrapper
      {...inputs.props}
      ref={inputs.editorRef}
    />
  );
}

