"use client";
import { forwardRef, type ForwardedRef } from 'react';

import { CloseIcon, PopupOption, PopupOptions, SettingsIcon } from '@/utils/style-utils';
import { Autocomplete } from '../autocomplete';
import { Confirmation } from '../confirmation';
import { AutocompleteOptionType, Props, FragmentProps } from './constants';
import { useInputs } from './inputs';
import { useOutputs } from './outputs';
import {
  AutocompleteOption,
  AutocompleteOptionLabel,
  AutocompleteOptionSynonyms,
  Body,
  BodyGroup,
  BodyHeader,
  CloseButton,
  Container,
  CustomGroupNameInput,
  Footer,
  FooterButton,
  PageTitle,
  SettingsButton,
  Tag,
  TagGroup,
} from './styles';


export const TagsConfig = forwardRef(function TagsConfig(
  props: Props,
  ref: ForwardedRef<HTMLDivElement>
) {
  const inputs = useInputs(ref);
  const outputs = useOutputs(props, inputs);
  const fragmentProps = { inputs, outputs };
  return (
    <Container
      ref={inputs.modalRef}
      children={
        <>
          <Body
            children={
              <>
                <SearchFragment
                  {...fragmentProps}
                />
                <SynonymsFragment
                  {...fragmentProps}
                />
                <GroupsFragment
                  {...fragmentProps}
                />
              </>
            }
          />
          <Footer
            children={
              <FooterButton
                if={!!inputs.synonymId}
                onClick={outputs.onClickStartOver}
                children='Start over'
                aria-label='Start over'
                title='Manage a new tag'
                highlighted={true}
              />
            }
          />
        </>
      }
    />
  );
});

const SearchFragment = ({ inputs, outputs }: FragmentProps) => (
  <BodyGroup
    children={
      <>
        <BodyHeader
          children={
            <>
              <PageTitle
                children={inputs.pageTitle}
              />
              <CloseButton
                children={<CloseIcon />}
                onClick={outputs.onClickCloseButton}
              />
            </>
          }
        />
        <Autocomplete<AutocompleteOptionType>
          inputPlaceholder='Start typing...'
          inputText={inputs.autocompleteText}
          showOptions={inputs.showAutocompleteOptions}
          ref={inputs.autocompleteRef}
          options={inputs.autocompleteOptions}
          onValueChange={outputs.onAutocompleteSelected}
          onInputEnterKeyUp={outputs.onAutocompleteInputEnter}
          onInputEscapeKeyUp={outputs.onAutocompleteInputCancel}
          onInputTextChange={outputs.onAutocompleteInputChange}
          onInputFocused={outputs.onAutocompleteInputFocused}
          onShowOptionsChange={outputs.onShowAutocompleteOptionsChange}
          disabled={!!inputs.groupSynonymId}
          renderOption={o => (
            <AutocompleteOption
              children={
                <>
                  <AutocompleteOptionLabel
                    children={o.label}
                  />
                  <AutocompleteOptionSynonyms
                    children={o.synonyms}
                  />
                </>
              }
            />
          )}
        />
      </>
    }
  />
);

const SynonymsFragment = ({ inputs, outputs }: FragmentProps) => (
  <BodyGroup
    if={!!inputs.tagsInSynonymGroup.length}
    $active={!inputs.groupId}
    children={
      <>
        <BodyHeader
          children={
            <>
              Synonyms
              <SettingsButton
                children={<SettingsIcon />}
                selected={inputs.modal === 'synonymOptions'}
                aria-label='Settings'
                $show={!inputs.groupId}
                ref={inputs.settingsButtonRef}
                onClick={outputs.onClickShowOptionsForSynonyms}
              />
            </>
          }
        />
        <TagGroup
          children={inputs.tagsInSynonymGroup.map(tag =>
            <Tag
              key={tag.id}
              ref={tag.id === inputs.tagId ? inputs.selectedTagRef : null}
              children={tag.text}
              $selected={tag.selected}
              $first={tag.first}
              $last={tag.last}
              onClick={e => outputs.onClickTagSynonym(tag.id, e)}
            />
          )}
        />
        <PopupOptions
          if={inputs.modal === 'synonymOptions'}
          ref={inputs.synonymOptionsRef}
          style={inputs.floatingRef.floatingStyles}
          onClick={outputs.onClickHideOptionsForSynonyms}
          children={
            <>
              <PopupOption
                onClick={outputs.onClickAddNewTagToSynonymGroup}
                children='Add to these Synonyms'
              />
              <PopupOption
                onClick={outputs.onClickAddCurrentSynonymsToExistingGroup}
                children='Add these Synonyms to Group'
              />
              <PopupOption
                if={!!inputs.tagId && inputs.tagsInSynonymGroup.length > 1}
                onClick={outputs.onClickRemoveTagFromSynonyms}
                children='Remove selection from these Synonyms'
              />
              <PopupOption
                if={!!inputs.tagId}
                children='Rename selection to something else'
                onClick={outputs.onClickRenameTag}
              />
              <PopupOption
                if={!!inputs.tagId}
                onClick={outputs.onClickConfirmDeleteTag}
                children='Delete selection'
              />
            </>
          }
        />
        <Confirmation
          if={inputs.modal === 'confirmDeleteTag'}
          onClose={outputs.onCancelConfirmation}
          onConfirm={outputs.onClickConfirmArchiveTag}
          title='Delete Tag Requested'
          message='Are you sure you want to delete this tag?'
          confirmText='Yes, Delete Tag'
        />
      </>
    }
  />
);

const GroupsFragment = ({ inputs, outputs }: FragmentProps) => (
  <>
    {inputs.tagsInCustomGroups
      .map(e => ({ ...e, active: inputs.groupId === e.group.id }))
      .map(({ group, synonyms, active }) => (
        <BodyGroup
          if={!!synonyms.length}
          key={group.id}
          $active={active}
          children={
            <>
              <BodyHeader
                children={
                  <>
                    Group:
                    <CustomGroupNameInput
                      value={active ? inputs.focusedGroupNameInputText : group.name}
                      onFocus={() => outputs.onCustomGroupNameFocus(group.id)}
                      onBlur={() => outputs.onCustomGroupNameBlur(group.id)}
                      onKeyUp={outputs.onCustomGroupNameKeyUp}
                      onChange={outputs.onCustomGroupNameChange}
                    />
                    <SettingsButton
                      children={<SettingsIcon />}
                      onClick={() => outputs.onClickShowOptionsForGroup(group.id)}
                      selected={inputs.modal === 'groupOptions'}
                      $show={active}
                      ref={active && inputs.modal === 'groupOptions' ? inputs.floatingRef.refs.setReference : null}
                      aria-label='Settings'
                    />
                  </>
                }
              />
              <TagGroup
                children={synonyms.map(({ synonymId, tags }) => (
                  tags.map(tag => (
                    <Tag
                      key={tag.id}
                      ref={active && inputs.groupSynonymId === inputs.synonymId ? inputs.selectedTagRef : null}
                      $selected={(inputs.hoveringGroupId === group.id && inputs.hoveringSynonymId === synonymId) || (active && inputs.groupSynonymId === synonymId)}
                      children={tag.text}
                      $first={tag.first}
                      $last={tag.last}
                      onClick={e => outputs.onClickGroupSynonym(group.id, synonymId, e)}
                      onMouseOver={() => outputs.onMouseOverGroupTag(group.id, synonymId)}
                      onMouseOut={outputs.onMouseOutGroupTag}
                    />
                  ))
                ))}
              />
              <PopupOptions
                if={active && inputs.modal === 'groupOptions'}
                ref={active && inputs.modal === 'groupOptions' ? inputs.floatingRef.refs.setFloating : null}
                style={inputs.floatingRef.floatingStyles}
                onClick={outputs.onClickHideOptionsForGroup}
                children={
                  <>
                    <PopupOption
                      children='Add to this Group'
                      onClick={outputs.onClickAddSynonymToCustomGroup}
                    />
                    <PopupOption
                      if={!!inputs.groupSynonymId && synonyms.length > 1}
                      children='Remove selection from Group'
                      onClick={outputs.onClickRemoveSynonymFromCustomGroup}
                    />
                    <PopupOption
                      if={!!inputs.groupSynonymId && inputs.groupSynonymId !== inputs.synonymId}
                      children='Update selection'
                      onClick={outputs.onClickUpdateGroupSynonym}
                    />
                    <PopupOption
                      children='Delete this Group'
                      onClick={outputs.onClickDeleteGroup}
                    />
                  </>
                }
              />
              <Confirmation
                if={inputs.modal === 'confirmDeleteGroup'}
                title='Delete Group Requested'
                message='Are you sure you want to delete this group?'
                confirmText='Yes, Delete Group'
                onClose={outputs.onCancelConfirmation}
                onConfirm={outputs.onClickConfirmArchiveGroup}
              />
            </>
          }
        />
      ))
    }
  </>
);