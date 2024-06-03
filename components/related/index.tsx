"use client";
import { useUnknownPropsStripper } from '@/utils/react-utils';
import { Card } from '../card';
import { Props } from './constants';
import { useInputs } from './inputs';
import { useOutputs } from './outputs';
import { Header, Icon, ListItem, ListItemsWrapper, NoResultsIcon, NoResultsWrapper, NoteCount, Result } from './styles';


export function Related(
  props: Props
) {
  const inputs = useInputs();
  const outputs = useOutputs(props, inputs);
  return (
    <Card
      {...useUnknownPropsStripper(props)}
      ref={inputs.cardRef}
      heading='Related'
      onScrolledToBottom={outputs.onScrolledToBottom}
      actions={(
        <NoteCount
          children={inputs.noteCountString}
        />
      )}
      body={
        <>
          <ListItemsWrapper
            if={!!inputs.items.length}
            children={inputs.items.map(note => (
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
            ))}
          />
          <NoResultsWrapper
            if={!inputs.items.length}
            children={
              <>
                <NoResultsIcon />
                no related notes
              </>
            }
          />
        </>
      }
    />
  )
}
