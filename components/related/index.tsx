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
  const { state, RelatedNotes, refs } = inputs;
  return (
    <Card
      className={props.className}
      ref={refs.card}
      heading='Related'
      actions={() => (
        <NoteCount
          children={state.noteCountString}
        />
      )}
      body={RelatedNotes ? <RelatedNotes onSelectNote={outputs.onSelectNote} /> : <></>}
      loading={state.loading}
    />
  )
}
