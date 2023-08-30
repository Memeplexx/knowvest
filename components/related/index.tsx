import dynamic from 'next/dynamic';
import { Card } from '../card';
import LoaderSkeleton from '../loader-skeleton';
import { Props } from './constants';
import { useInputs } from './inputs';
import { useOutputs } from './outputs';
import { NoteCount } from './styles';

const RelatedItems = dynamic(() => import('../related-items'), {
  ssr: false,
  loading: () => <LoaderSkeleton count={15} />,
});

export const Related = (
  props: Props
) => {
  const inputs = useInputs(props);
  const outputs = useOutputs(inputs);
  const { state } = inputs;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { onSelectNote, ...remainingProps } = props;
  return (
    <Card
      {...remainingProps}
      title='Related'
      $themeType='dark'
      actions={
        <NoteCount
          children={state.noteCountString}
        />
      }
      body={
        <RelatedItems
          onSelectNote={outputs.onSelectNote}
        />
      }
    />
  )
}
