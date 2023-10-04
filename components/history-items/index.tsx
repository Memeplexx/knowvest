import { useInputs } from './inputs';
import { Props } from './constants';
import { Header, Icon, Result, RightBorder, Wrapper } from './styles';

export default function HistoryItems(
  props: Props
) {
  const inputs = useInputs(props);
  const { state, store } = inputs;
  return (
    <>
      {state.map(note => (
        <Wrapper
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
              <RightBorder
              />
            </>
          }
        />
      ))}
    </>
  )
}
