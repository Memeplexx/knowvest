import { Card } from '../card';
import { useInputs } from './inputs';
import { useOutputs } from './outputs';
import { Props } from './constants';
import LoaderSkeleton from '../loader-skeleton';
import dynamic from 'next/dynamic';
import { Loading } from './styles';

const HistoryItems = dynamic(() => import('../history-items'), {
  ssr: false,
  loading: () => <LoaderSkeleton count={15} />,
});

export const History = (
  props: Props
) => {
  const inputs = useInputs(props);
  const events = useOutputs(inputs);
  const { state } = inputs;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { onSelectNote, ...remainingProps } = props;
  return (
    <Card
      {...remainingProps}
      title='Recent'
      body={
        <>
          <HistoryItems
            onSelectNote={events.onSelectNote}
          />
          <Loading
            showIf={state.initialized}
            show={state.loadingNotes}
          />
        </>
      }
    />
  )
};
