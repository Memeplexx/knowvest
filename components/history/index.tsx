import { Card } from '../card';
import { Props } from './constants';
import { useInputs } from './inputs';
import { useOutputs } from './outputs';

export const History = (
  props: Props
) => {
  const inputs = useInputs(props);
  const outputs = useOutputs(inputs);
  return (
    <Card
      className={props.className}
      ref={inputs.cardRef}
      heading='Recent'
      body={inputs.downloaded && <inputs.downloaded onSelectNote={outputs.onSelectNote} innerRef={inputs.listItemsRef} />}
      loading={!inputs.downloaded}
      onScrolledToBottom={inputs.listItemsRef.current?.onScrollToBottom}
    />
  )
};
