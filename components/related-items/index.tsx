import { Props } from './constants';
import { useInputs } from './inputs';
import { Header, Icon, ListItemsWrapper, NoResultsWrapper, NoResultsIcon, Result, ListItem } from './styles';


export default function Related(
  props: Props
) {
  const inputs = useInputs(props);
  return (
    <>
      <ListItemsWrapper
        children={
          inputs.items.map(note => (
            <ListItem
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
          ))
        }
      />
      <NoResultsWrapper
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
