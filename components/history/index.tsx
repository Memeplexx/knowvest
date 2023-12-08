import { Card } from '../card';
import { Props } from './constants';
import { useInputs } from './inputs';
import { useOutputs } from './outputs';

export const History = (
  props: Props
) => {
  const inputs = useInputs(props);
  const outputs = useOutputs(inputs);
  const { state, HistoricalNotes, refs } = inputs;
  return (
    <Card
      className={props.className}
      ref={refs.card}
      heading='Recent'
      body={HistoricalNotes ? <HistoricalNotes onSelectNote={outputs.onSelectNote} /> : <></>}
      loading={state.loading}
    />
  )
};
