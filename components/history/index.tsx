"use client";
import { useInputs } from './inputs';
import { Props } from './constants';
import { Header, Icon, Result, RightBorder, ListItem, ListItemsWrapper, NoResultsWrapper, NoResultsIcon, LoaderPlaceholder } from './styles';
import { useOutputs } from './outputs';
import { Card } from '../card';

export function History(
  props: Props,
) {
  const inputs = useInputs(props);
  const outputs = useOutputs(inputs);
  return (
    <Card
      className={props.className}
      ref={inputs.cardRef}
      heading='Recent'
      // body={inputs.HistoryItems && <inputs.HistoryItems onSelectNote={outputs.onSelectNote} innerRef={inputs.listItemsRef} />}
      // loading={!inputs.HistoryItems}
      onScrolledToBottom={inputs.listItemsRef.current?.onScrollToBottom}
      body={
        <>
          <ListItemsWrapper
            showIf={inputs.stateInitialized && !!inputs.items.length}
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
          <LoaderPlaceholder
            showIf={!inputs.stateInitialized}
          />
        </>
      }
    />
  )
}
