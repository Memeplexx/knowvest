import { Card } from '../card';
import { LoaderSkeleton } from '../loader-skeleton';
import { Props } from './constants';
import { useInputs } from './inputs';
import { useOutputs } from './outputs';

export const History = (
  props: Props
) => {
  const inputs = useInputs(props);
  const events = useOutputs(inputs);
  const { state, HistoricalNotes, refs } = inputs;
  return (
    <Card
      className={props.className}
      ref={refs.card}
      title='Recent'
      body={
        <>
          <HistoricalNotes
            onSelectNote={events.onSelectNote}
          />
          <LoaderSkeleton
            count={15}
            isVisible={state.loading}
          />
        </>
      }
    />
  )
};
