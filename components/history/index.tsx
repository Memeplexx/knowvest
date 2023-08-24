import { Card } from '../card';
import { useInputs } from './inputs';
import { useOutputs } from './outputs';
import { Props } from './constants';
import { usePropsWithoutFunctions } from '@/utils/functions';
import { Header, Icon, Result, RightBorder, Wrapper } from './styles';
import { store } from '@/utils/store';

export const History = (
  props: Props
) => {
  const inputs = useInputs(props);
  const events = useOutputs(inputs);
  const { state } = inputs;
  return (
    <Card
      {...usePropsWithoutFunctions(props)}
      title='Recent'
      $themeType='dark'
      body={
        <>
          {state.notes.map(note => (
            <Wrapper
              key={note.id}
              onClick={() => events.onSelectNote(note.id)}
              children={
                <>
                  <Header
                    children={
                      <>
                        {note.date}
                        <Icon />
                      </>
                    }
                  />
                  <Result
                    note={note}
                    synonymIds={store.synonymIds}
                  />
                  <RightBorder
                  />
                </>
              }
            />
          ))}
        </>
      }
    />
  )
};
