import { useInputs } from './inputs';
import { Props } from './constants';
import { Header, Icon, Result, RightBorder, ListItem, ListItemsWrapper, NoResultsWrapper, NoResultsIcon } from './styles';

export default function HistoryItems(
  props: Props
) {
  const inputs = useInputs(props);
  const { state, store } = inputs;
  return (
    <>
      <ListItemsWrapper
        showIf={!!state.length}
        children={
          state.map(note => (
            <ListItem
              key={note.id}
              onClick={() => props.onSelectNote(note.id)}
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
                  <RightBorder />
                </>
              }
            />
          ))}
      />
      <NoResultsWrapper
        showIf={!state.length}
        children={
          <>
            <NoResultsIcon />
            no historical notes
          </>
        }
      />
    </>
  )
}
