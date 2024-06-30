"use client";
import { useUnknownPropsStripper } from '@/utils/react-utils';
import { Props } from './constants';
import { useInputs } from './inputs';
import { PanelNoteReadonlyWrapper } from './styles';

export function PanelNoteReadonly(
  props: Props
) {
  const inputs = useInputs(props);
  return (
    <PanelNoteReadonlyWrapper
      {...useUnknownPropsStripper(props)}
      ref={inputs.editorRef}
    />
  );
}

