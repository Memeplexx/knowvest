"use client";
import { useUnknownPropsStripper } from '@/utils/react-utils';
import { Props } from './constants';
import { useInputs } from './inputs';
import { useOutputs } from './outputs';
import { Header, HistoryWrapper, Icon, ListItem, ListItemsWrapper, NoResultsIcon, NoResultsWrapper, Result, RightBorder } from './styles';

export function History(
  props: Props,
) {
  const inputs = useInputs();
  const outputs = useOutputs(props, inputs);
  return (
    <HistoryWrapper
      {...useUnknownPropsStripper(props)}
      ref={inputs.cardRef}
      heading={
        <>
          History
          <div />
        </>
      }
      onScrolledToBottom={outputs.onScrolledToBottom}
      body={
        <>
          <ListItemsWrapper
            if={!!inputs.items.length}
            children={inputs.items.map(note => (
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
            if={!inputs.items.length}
            children={
              <>
                <NoResultsIcon />
                no historical notes
              </>
            }
          />
        </>
      }
    />
  )
}
