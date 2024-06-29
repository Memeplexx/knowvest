"use client";
import { useUnknownPropsStripper } from '@/utils/react-utils';
import { Props } from './constants';
import { useInputs } from './inputs';
import { ReadonlyNoteWrapper } from './styles';

export function ReadonlyNote(
  props: Props
) {
  const inputs = useInputs(props);
  return (
    <ReadonlyNoteWrapper
      {...useUnknownPropsStripper(props)}
      ref={inputs.editorRef}
    />
  );
}

