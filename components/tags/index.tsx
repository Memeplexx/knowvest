import { HTMLAttributes, forwardRef, ForwardedRef, Fragment } from 'react';

import { IconButton } from '../card-header-button';
import {
  ActiveHeaderTag,
  Tag,
  Body,
  SettingsIcon,
  TagsSection,
  TagsWrapper,
  GroupHeaderTag,
} from './styles';
import { TagsConfig } from '../tags-config';
import { useInputs } from './inputs';
import { useOutputs } from './outputs';
import { Card } from '../card';


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
      <Card
        {...props}
        title='Tags for active note'
        $themeType='light'
        ref={refs.container}
        actions={
          <IconButton
            children={<SettingsIcon />}
            onClick={outputs.onShowDialog}
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
                        selected={state.allActiveTagsSelected}
                        onClick={outputs.onChangeAllActiveTagsSelected}
                        children='Active'
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
              </>
            }
          />
        }
      />
    </>
  )
});
