"use client";
import { Props } from './constants';
import { useInputs } from './inputs';
import { Header, Icon, ListItemsWrapper, NoResultsWrapper, NoResultsIcon, Result, ListItem } from './styles';


export default function RelatedItems(
  props: Props
) {
  const inputs = useInputs(props);
  return (
    <>
      <ListItemsWrapper
        $showIf={inputs.stateInitialized && !!inputs.items.length}
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
        showIf={inputs.stateInitialized && !inputs.items.length}
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
