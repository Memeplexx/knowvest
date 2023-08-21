import { useHooks } from './hooks';
import { useSimilarEvents } from './events';
import { Header, Icon, NoteCount, Result, Wrapper } from './styles';
import { Card } from '../card';
import { Props } from './constants';
import { usePropsWithoutFunctions } from '@/utils/functions';


export const Related = (
  props: Props
) => {
  const state = useHooks(props);
  const events = useSimilarEvents(state);
  return (
    <Card
      {...usePropsWithoutFunctions(props)}
      title='Related'
      $themeType='dark'
      actions={
        <NoteCount
          children={`${state.queriedNotes.length} result${state.queriedNotes.length !== 1 && 's'}`}
        />
      }
      body={
        <>
          {state.queriedNotes.map(note => (
            <Wrapper
              key={note.note.id}
              onClick={() => events.onSelectNote(note.note.id)}
              children={
                <>
                  <Header
                    children={
                      <>
                        {note.count} match{note.count !== 1 && 'es'}
                        <Icon />
                      </>
                    }
                  />
                  <Result
                    note={note.note}
                    synonymIds={state.appStore.synonymIds}
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
