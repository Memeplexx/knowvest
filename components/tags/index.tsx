import { Fragment } from 'react';

import { Button } from '../button';
import { Modal } from '../modal';
import { TagsConfig } from '../tags-config';
import { useInputs } from './inputs';
import { useOutputs } from './outputs';
import {
  ActiveHeaderTag,
  Body,
  GroupHeaderTag,
  NoTagsPlaceholder,
  SettingsButton,
  SettingsIcon,
  Tag,
  TagsSection,
  TagsWrapper,
} from './styles';


export const Tags = () => {
  const inputs = useInputs();
  const outputs = useOutputs(inputs);
  const { showConfigDialog, tagsForActiveNote, allActiveTagsSelected, groupsWithSynonyms, allGroupTagsSelected, hoveringGroupId, hoveringSynonymId } = inputs;
  return (
    <>
      <Modal
        showIf={showConfigDialog}
        onClose={outputs.onHideDialog}
        children={
          <TagsConfig
            onHide={outputs.onHideDialog}
          />
        }
      />
      <SettingsButton
        showIf={!!tagsForActiveNote.length}
        children={<SettingsIcon />}
        onClick={outputs.onShowDialog}
        aria-label='Settings'
      />
      <Body
        children={
          <>
            <TagsSection
              children={
                <>
                  <ActiveHeaderTag
                    showIf={!tagsForActiveNote.length}
                    selected={allActiveTagsSelected}
                    onClick={outputs.onChangeAllActiveTagsSelected}
                    children='Active'
                    $first={true}
                    $last={true}
                    $active={allActiveTagsSelected}
                  />
                  <TagsWrapper
                    children={
                      tagsForActiveNote.map(synonyms => (
                        <Fragment
                          key={synonyms.synonymId}
                          children={synonyms.tags.map(tag => (
                            <Tag
                              key={tag.id}
                              selected={synonyms.selected}
                              $active={tag.active}
                              $first={tag.first}
                              $last={tag.last}
                              children={tag.text}
                              onClick={() => outputs.onClickSynonym(tag.synonymId)}
                            />
                          ))}
                        />
                      ))
                    }
                  />
                </>
              }
            />
            {groupsWithSynonyms.map(group => (
              <TagsSection
                key={group.groupId}
                children={
                  <>
                    <GroupHeaderTag
                      selected={!!allGroupTagsSelected.get(group.groupId)}
                      onClick={() => outputs.onChangeAllGroupTagsSelected(group.groupId)}
                      children={`Group: ${group.groupName}`}
                      $first={true}
                      $last={true}
                      $active={!!allGroupTagsSelected.get(group.groupId)}
                    />
                    <TagsWrapper
                      children={group.synonyms.map(synonym => (
                        synonym.tags.map(tag => (
                          <Tag
                            key={tag.id}
                            selected={(hoveringGroupId === group.groupId && hoveringSynonymId === synonym.id) || synonym.selected}
                            onClick={() => outputs.onClickSynonym(synonym.id)}
                            children={tag.text}
                            $first={tag.first}
                            $last={tag.last}
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
              showIf={!tagsForActiveNote.length}
              children={
                <>
                  No tags associated with active note
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
    </>
  )
}
