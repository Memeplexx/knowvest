import { Props } from './constants';
import { useInputs } from './inputs';
import { Header, Icon, NoResults, NoResultsIcon, Result, Wrapper } from './styles';


export default function Related(
  props: Props
) {
  const inputs = useInputs(props);
  return (
    <>
      {inputs.items.map(note => (
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
                synonymIds={inputs.store.synonymIds}
              />
            </>
          }
        />
      ))}
      <NoResults
        showIf={inputs.items.length === 0}
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
