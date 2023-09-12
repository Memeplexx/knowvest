import { useInputs } from './inputs';
import { Props } from './constants';
import { Header, Icon, Result, RightBorder, Wrapper } from './styles';
import { store } from '@/utils/store';

export default function HistoryItems(
  props: Props
) {
  const inputs = useInputs(props);
  const { state } = inputs;
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
