"use client";
import { useUnknownPropsStripper } from '@/utils/react-utils';
import { store } from '@/utils/store-utils';
import { Props } from './constants';
import { useInputs } from './inputs';
import { useOutputs } from './outputs';
import { Header, Icon, ListItem, ListItemsWrapper, NoResultsIcon, NoResultsWrapper, PanelNotesPreviousWrapper, Result, RightBorder } from './styles';

export function PanelNotesPrevious(
  props: Props,
) {
  const inputs = useInputs();
  const outputs = useOutputs(props, inputs);
  return (
    <PanelNotesPreviousWrapper
      {...useUnknownPropsStripper(props)}
      children={
        <>
          <ListItemsWrapper
            if={!!inputs.items.length}
            children={inputs.items.map(note => (
              <ListItem
                key={note.id}
                onClick={outputs.onSelectNote(note.id)}
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