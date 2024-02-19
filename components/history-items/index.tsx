"use client";
import { useInputs } from './inputs';
import { Props } from './constants';
import { Header, Icon, Result, RightBorder, ListItem, ListItemsWrapper, NoResultsWrapper, NoResultsIcon } from './styles';
import { useOutputs } from './outputs';

export default function HistoryItems (
  props: Props,
) {
  const inputs = useInputs(props);
  const outputs = useOutputs(inputs);
  return (
    <>
      <ListItemsWrapper
        $showIf={inputs.stateInitialized && !!inputs.items.length}
        children={
          inputs.items.map(note => (
            <ListItem
              key={note.id}
              onClick={() => outputs.onSelectNote(note.id)}
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
                    synonymIds={inputs.store.synonymIds}
                  />
                  <RightBorder />
                </>
              }
            />
          ))}
      />
      <NoResultsWrapper
        showIf={inputs.stateInitialized && !inputs.items.length}
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
