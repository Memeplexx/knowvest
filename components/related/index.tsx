"use client";
import { Card } from '../card';
import { Props } from './constants';
import { useInputs } from './inputs';
import { useOutputs } from './outputs';
import { NoteCount } from './styles';


export const Related = (
  props: Props
) => {
  const inputs = useInputs(props);
  const outputs = useOutputs(inputs);
  return (
    <Card
      className={props.className}
      ref={inputs.cardRef}
      heading='Related'
      actions={() => (
        <NoteCount
          children={inputs.noteCountString}
        />
      )}
      body={inputs.RelatedItems && <inputs.RelatedItems onSelectNote={outputs.onSelectNote} />}
      loading={!inputs.RelatedItems}
    />
  )
}
