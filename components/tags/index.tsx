import { type HTMLAttributes, forwardRef, type ForwardedRef, Fragment } from 'react';

import { ButtonIcon } from '../button-icon';
import {
  ActiveHeaderTag,
  Tag,
  Body,
  SettingsIcon,
  TagsSection,
  TagsWrapper,
  GroupHeaderTag,
  Wrapper,
  CardWrapper,
  NoTagsPlaceholder,
} from './styles';
import { TagsConfig } from '../tags-config';
import { useInputs } from './inputs';
import { useOutputs } from './outputs';
import { Button } from '../button';


export const Tags = forwardRef(function Tags(
  props: HTMLAttributes<HTMLDivElement>,
  ref: ForwardedRef<HTMLElement>
) {
  const inputs = useInputs(ref);
  const outputs = useOutputs(inputs);
  const { state, refs } = inputs;
  return (
    <>
      <TagsConfig
        show={state.showConfigDialog}
        onHide={outputs.onHideDialog}
      />
      <Wrapper
        children={
          <CardWrapper
            {...props}
            title='Tags'
            ref={refs.container}
            actions={
              <ButtonIcon
                showIf={!!state.tagsForActiveNote.length}
                children={<SettingsIcon />}
                onClick={outputs.onShowDialog}
                aria-label='Settings'
              />
            }
            body={
              <Body
                children={
                  <>
                    <TagsSection
                      children={
                        <>
                          <ActiveHeaderTag
                            showIf={!!state.tagsForActiveNote.length}
                            selected={state.allActiveTagsSelected}
                            onClick={outputs.onChangeAllActiveTagsSelected}
                            children='Active'
                            $first={true}
                            $last={true}
                            $active={state.allActiveTagsSelected}
                          />
                          <TagsWrapper
                            children={
                              state.tagsForActiveNote.map(synonyms => (
                                <Fragment
                                  key={synonyms.synonymId}
                                  children={synonyms.tags.map((t, i) => (
                                    <Tag
                                      key={t.id}
                                      selected={synonyms.selected}
                                      $active={t.active}
                                      $first={!i}
                                      $last={i === synonyms.tags.length - 1}
                                      children={t.text}
                                      onClick={() => outputs.onClickSynonym(t.synonymId)}
                                    />
                                  ))}
                                />
                              ))
                            }
                          />
                        </>
                      }
                    />
                    {state.groupsWithSynonyms.map(group => (
                      <TagsSection
                        key={group.groupId}
                        children={
                          <>
                            <GroupHeaderTag
                              selected={!!state.allGroupTagsSelected.get(group.groupId)}
                              onClick={() => outputs.onChangeAllGroupTagsSelected(group.groupId)}
                              children={`Group: ${group.groupName}`}
                              $first={true}
                              $last={true}
                              $active={!!state.allGroupTagsSelected.get(group.groupId)}
                            />
                            <TagsWrapper
                              children={group.synonyms.map(synonym => (
                                synonym.tags.map((tag, i) => (
                                  <Tag
                                    key={tag.id}
                                    selected={(state.hoveringGroupId === group.groupId && state.hoveringSynonymId === synonym.id) || synonym.selected}
                                    onClick={() => outputs.onClickSynonym(synonym.id)}
                                    children={tag.text}
                                    $first={!i}
                                    $last={i === synonym.tags.length - 1}
                                    onMouseOver={() => outputs.onMouseOverGroupTag(group.groupId, synonym.id)}
                                    onMouseOut={outputs.onMouseOutGroupTag}
                                    $active={tag.active}
                                  />
                                ))
                              ))}
                            />
                          </>
                        }
                      />
                    ))}
                    <NoTagsPlaceholder
                      showIf={!state.tagsForActiveNote.length}
                      children={
                        <>
                          No tags associated with this note
                          <Button
                            children='Configure tags'
                            onClick={outputs.onShowDialog}
                            aria-label="Configure tags"
                            highlighted={true}
                          />
                        </>
                      }
                    />
                  </>
                }
              />
            }
          />
        }
      />
    </>
  )
});
