"use client";
import { useHtmlPropsOnly } from '@/utils/react-utils';
import { Props } from './constants';
import { useInputs } from './inputs';
import { PanelNoteReadonlyWrapper } from './styles';

export function PanelNoteReadonly(
  props: Props
) {
  const inputs = useInputs(props);
  return (
    <PanelNoteReadonlyWrapper
      {...useHtmlPropsOnly(props)}
      ref={inputs.editorRef}
    />
  );
}

