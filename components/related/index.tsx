"use client";
import { useUnknownPropsStripper } from '@/utils/react-utils';
import { Props } from './constants';
import { useInputs } from './inputs';
import { useOutputs } from './outputs';
import { Header, Icon, ListItem, ListItemsWrapper, NoResultsIcon, NoResultsWrapper, RelatedWrapper, Result } from './styles';


export function Related(
  props: Props
) {
  const inputs = useInputs();
  const outputs = useOutputs(inputs);
  return (
    <RelatedWrapper
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
