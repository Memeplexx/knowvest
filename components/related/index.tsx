"use client";
import { useUnknownPropsStripper } from '@/utils/react-utils';
import { FilterIcon } from '@/utils/style-utils';
import { ButtonIcon } from '../button-icon';
import { Popup } from '../popup';
import { Props } from './constants';
import { useInputs } from './inputs';
import { useOutputs } from './outputs';
import { FilterPopup, Header, Icon, ListItem, ListItemsWrapper, NoResultsIcon, NoResultsWrapper, RelatedWrapper, Result } from './styles';


export function Related(
  props: Props
) {
  const inputs = useInputs();
  const outputs = useOutputs(props, inputs);
  return (
    <RelatedWrapper
      {...useUnknownPropsStripper(props)}
      ref={inputs.cardRef}
      onScrolledToBottom={outputs.onScrolledToBottom}
      heading={
        <>
          Related ({inputs.items.length})
          <Popup
            storeKey='relatedMenu'
            // ref={inputs.popupRef}
            trigger={props => (
              <ButtonIcon
                {...props}
                aria-label='Filter'
                children={<FilterIcon />}
              />
            )}
            overlay={
              <FilterPopup />
            }
          />
        </>
      }
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
