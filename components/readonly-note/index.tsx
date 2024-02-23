"use client";
import { Props } from './constants';
import { useInputs } from './inputs';
import { Wrapper } from './styles';

export default function ReadonlyNote(
  props: Props
) {
  const inputs = useInputs(props);
  const { showIf, synonymIds, ...remainingProps } = props;
  return (
    <Wrapper
      {...remainingProps}
      ref={inputs.editorRef}
    />
  );
}

