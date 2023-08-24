import { useInputs } from './inputs';
import { useOutputs } from './outputs';
import { Header, Icon, NoteCount, Result, Wrapper } from './styles';
import { Card } from '../card';
import { Props } from './constants';
import { usePropsWithoutFunctions } from '@/utils/functions';
import { store } from '@/utils/store';


export const Related = (
  props: Props
) => {
  const inputs = useInputs(props);
  const outputs = useOutputs(inputs);
  const { state } = inputs;
  return (
    <Card
      {...usePropsWithoutFunctions(props)}
      title='Related'
      $themeType='dark'
      actions={
        <NoteCount
          children={state.noteCountString}
        />
      }
      body={
        <>
          {state.queriedNotes.map(note => (
            <Wrapper
              key={note.note.id}
              onClick={() => outputs.onSelectNote(note.note.id)}
              children={
                <>
                  <Header
                    children={
                      <>
                        {note.matches}
                        <Icon />
                      </>
                    }
                  />
                  <Result
                    note={note.note}
                    synonymIds={store.synonymIds}
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
