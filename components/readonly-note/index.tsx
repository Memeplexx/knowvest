"use client";
import { useUnknownPropsStripper } from '@/utils/react-utils';
import { Props } from './constants';
import { useInputs } from './inputs';
import { Wrapper } from './styles';

export default function ReadonlyNote(
  props: Props
) {
  const inputs = useInputs(props);
  return (
    <Wrapper
      {...useUnknownPropsStripper(props)}
      ref={inputs.editorRef}
    />
  );
}

