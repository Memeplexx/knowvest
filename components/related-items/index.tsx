import { store } from '@/utils/store';
import { Props } from './constants';
import { useInputs } from './inputs';
import { Header, Icon, NoResults, NoResultsIcon, Result, Wrapper } from './styles';


export default function Related(
  props: Props
) {
  const inputs = useInputs(props);
  const { state } = inputs;
  return (
    <>
      {state.map(note => (
        <Wrapper
          key={note.note.id}
          onClick={() => props.onSelectNote(note.note.id)}
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
      <NoResults
        showIf={state.length === 0}
        children={
          <>
            <NoResultsIcon />
            no related notes
          </>
        }
      />
    </>
  )
}
