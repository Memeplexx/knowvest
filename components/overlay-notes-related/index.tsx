"use client";
import { Fragment } from 'react';

import { CiFilter } from 'react-icons/ci';
import { ControlButtonFancy } from '../control-button-fancy';
import { ControlButtonIcon } from '../control-button-icon';
import { OverlayPopup } from '../overlay-popup';
import { FragmentProps, TagsProps } from './constants';
import { useInputs } from './inputs';
import { useOutputs } from './outputs';
import {
  ActiveHeaderTag,
  GroupHeaderTag,
  NoTagsPlaceholder,
  OverlayNotesRelatedWrapper,
  SynonymsWrapper,
  Tag,
  TagsSection,
} from './styles';


export const OverlayNotesRelated = (props: TagsProps) => {
  const inputs = useInputs();
  const outputs = useOutputs(inputs);
  const fragmentProps = { inputs, outputs };
  return (
    <OverlayPopup
      storeKey='relatedMenu'
      trigger={props => (
        <ControlButtonIcon
          {...props}
          aria-label='Filter'
          children={<CiFilter />}
        />
      )}
      overlay={
        <OverlayNotesRelatedWrapper
          {...props}
          children={
            <>
              <SynonymsFragment
                {...fragmentProps}
              />
              <GroupSynonymsFragment
                {...fragmentProps}
              />
              <PlaceholderFragment
                {...fragmentProps}
              />
            </>
          }
        />
      }
    />
  );
}

const PlaceholderFragment = ({ inputs, outputs }: FragmentProps) => {
  return (
    <NoTagsPlaceholder
      if={!inputs.tagsForActiveNote.length}
      children={
        <>
          No tags associated with active note
          <ControlButtonFancy
            children='Configure tags'
            onClick={outputs.onShowDialog}
            aria-label="Configure tags"
            highlighted={true}
          />
        </>
      }
    />
  );
}

const SynonymsFragment = ({ inputs, outputs }: FragmentProps) => {
  return (
    <TagsSection
      children={
        <>
          <ActiveHeaderTag
            if={!!inputs.tagsForActiveNote.length}
            $selected={inputs.allActiveTagsSelected}
            onClick={outputs.onChangeAllActiveTagsSelected}
            children='Active'
            $first={true}
            $last={true}
          />
          <SynonymsWrapper
            children={inputs.tagsForActiveNote.map(synonyms => (
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
            ))}
          />
        </>
      }
    />
  )
}

const GroupSynonymsFragment = ({ inputs, outputs }: FragmentProps) => {
  return (
    <>
      {inputs.groupsWithSynonyms.map(group => (
        <TagsSection
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
              <SynonymsWrapper
                children={group.synonyms.map(synonym => synonym.tags.map(tag => (
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
                )))}
              />
            </>
          }
        />
      ))}
    </>
  )
}
