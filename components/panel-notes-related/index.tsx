"use client";
import { useUnknownPropsStripper } from '@/utils/react-utils';
import { store } from '@/utils/store-utils';
import { Props } from './constants';
import { useInputs } from './inputs';
import { useOutputs } from './outputs';
import { Header, Icon, ListItem, ListItemsWrapper, NoResultsIcon, NoResultsWrapper, PanelNotesRelatedWrapper, Result } from './styles';


export function PanelNotesRelated(
  props: Props
) {
  const inputs = useInputs();
  const outputs = useOutputs(props, inputs);
  return (
    <PanelNotesRelatedWrapper
      {...useUnknownPropsStripper(props)}
      children={
        <>
          <ListItemsWrapper
            if={!!inputs.items.length}
            children={inputs.items.map(note => (
              <ListItem
                key={note.note.id}
                onClick={outputs.onSelectNote(note.note.id)}
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
                      synonymIds={store.synonymIds}
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
