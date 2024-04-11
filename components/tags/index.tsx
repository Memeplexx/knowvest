"use client";
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
  LoaderPlaceholder,
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
  return (
    <>
      <Modal
        if={inputs.showConfigDialog}
        children={
          <TagsConfig
            onHide={outputs.onHideDialog}
          />
        }
      />
      <SettingsButton
        if={!!inputs.tagsForActiveNote.length}
        children={<SettingsIcon />}
        onClick={outputs.onShowDialog}
        aria-label='Settings'
      />
      <Body
        children={
          <>
            <TagsSection
              if={inputs.stateInitialized}
              children={
                <>
                  <ActiveHeaderTag
                    $show={!inputs.tagsForActiveNote.length}
                    $selected={inputs.allActiveTagsSelected}
                    onClick={outputs.onChangeAllActiveTagsSelected}
                    children='Active'
                    $first={true}
                    $last={true}
                  />
                  <TagsWrapper
                    children={
                      inputs.tagsForActiveNote.map(synonyms => (
                        <Fragment
                          key={synonyms.synonymId}
                          children={synonyms.tags.map(tag => (
                            <Tag
                              key={tag.id}
                              $selected={synonyms.selected}
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
            {inputs.groupsWithSynonyms.map(group => (
              <TagsSection
                if={inputs.stateInitialized}
                key={group.groupId}
                children={
                  <>
                    <GroupHeaderTag
                      $selected={!!inputs.allGroupTagsSelected.get(group.groupId)}
                      onClick={() => outputs.onChangeAllGroupTagsSelected(group.groupId)}
                      children={`Group: ${group.groupName}`}
                      $first={true}
                      $last={true}
                    />
                    <TagsWrapper
                      children={group.synonyms.map(synonym => (
                        synonym.tags.map(tag => (
                          <Tag
                            key={tag.id}
                            children={tag.text}
                            $first={tag.first}
                            $last={tag.last}
                            $selected={(inputs.hoveringGroupId === group.groupId && inputs.hoveringSynonymId === synonym.id) || synonym.selected}
                            onMouseOver={() => outputs.onMouseOverGroupTag(group.groupId, synonym.id)}
                            onMouseOut={outputs.onMouseOutGroupTag}
                            onClick={() => outputs.onClickSynonym(synonym.id)}
                          />
                        ))
                      ))}
                    />
                  </>
                }
              />
            ))}
            <NoTagsPlaceholder
              if={inputs.stateInitialized && !inputs.tagsForActiveNote.length}
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
            <LoaderPlaceholder
              if={!inputs.stateInitialized}
            />
          </>
        }
      />
    </>
  )
}
