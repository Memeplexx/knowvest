import { Card } from '../card';
import { LoaderSkeleton } from '../loader-skeleton';
import { Props } from './constants';
import { useInputs } from './inputs';
import { useOutputs } from './outputs';
import { NoteCount } from './styles';



export const Related = (
  props: Props
) => {
  const inputs = useInputs(props);
  const outputs = useOutputs(inputs);
  const { state, RelatedNotes } = inputs;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { onSelectNote, ...remainingProps } = props;
  return (
    <Card
      {...remainingProps}
      title='Related'
      actions={
        <NoteCount
          children={state.noteCountString}
        />
      }
      body={
        <>
          <RelatedNotes
            onSelectNote={outputs.onSelectNote}
          />
          <LoaderSkeleton
            count={15}
            isVisible={state.loadingRelatedNotes}
          />
        </>
      }
    />
  )
}
