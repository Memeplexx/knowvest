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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { onSelectNote, ...remainingProps } = props;
  return (
    <Card
      {...remainingProps}
      ref={refs.card}
      title='Recent'
      body={
        <>
          <HistoricalNotes
            onSelectNote={events.onSelectNote}
          />
          <LoaderSkeleton
            count={15}
            isVisible={state.loadingHistoricalNotes}
          />
        </>
      }
    />
  )
};
