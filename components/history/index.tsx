"use client";
import { Card } from '../card';
import { Props } from './constants';
import { useInputs } from './inputs';
import { useOutputs } from './outputs';
import { Header, Icon, ListItem, ListItemsWrapper, LoaderPlaceholder, NoResultsIcon, NoResultsWrapper, Result, RightBorder } from './styles';

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
      onScrolledToBottom={outputs.onScrolledToBottom}
      body={
        <>
          <ListItemsWrapper
            if={inputs.stateInitialized && !!inputs.items.length}
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
            if={inputs.stateInitialized && !inputs.items.length}
            children={
              <>
                <NoResultsIcon />
                no historical notes
              </>
            }
          />
          <LoaderPlaceholder
            if={!inputs.stateInitialized}
          />
        </>
      }
    />
  )
}
