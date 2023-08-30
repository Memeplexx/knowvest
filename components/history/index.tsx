import { Card } from '../card';
import { useInputs } from './inputs';
import { useOutputs } from './outputs';
import { Props } from './constants';
import LoaderSkeleton from '../loader-skeleton';
import dynamic from 'next/dynamic';

const HistoryItems = dynamic(() => import('../history-items'), {
  ssr: false,
  loading: () => <LoaderSkeleton count={15} />,
});

export const History = (
  props: Props
) => {
  const inputs = useInputs(props);
  const events = useOutputs(inputs);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { onSelectNote, ...remainingProps } = props;
  return (
    <Card
      {...remainingProps}
      title='Recent'
      $themeType='dark'
      body={
        <HistoryItems
          onSelectNote={events.onSelectNote}
        />
      }
    />
  )
};
