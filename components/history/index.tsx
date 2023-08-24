import { Card } from '../card';
import { useHooks } from './hooks';
import { defineEvents } from './events';
import { Props } from './constants';
import { usePropsWithoutFunctions } from '@/utils/functions';
import { Header, Icon, Result, RightBorder, Wrapper } from './styles';
import { store } from '@/utils/store';

export const History = (
  props: Props
) => {
  const state = useHooks(props);
  const events = defineEvents(state);
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
