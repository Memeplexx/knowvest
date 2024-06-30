"use client";

import { ControlAutocomplete } from '@/components/control-autocomplete';
import { OverlayConfirmation } from '@/components/overlay-confirmation';
import { PopupOption, PopupOptions, SettingsIcon } from '@/utils/style-utils';
import { AutocompleteOptionType, FragmentProps } from './constants';
import { useInputs } from './inputs';
import { useOutputs } from './outputs';
import {
  AutocompleteOption,
  AutocompleteOptionLabel,
  AutocompleteOptionSynonyms,
  Body,
  BodyGroup,
  BodyHeader,
  CustomGroupNameInput,
  Footer,
  FooterButton,
  LeftContent,
  NoResultsWrapper,
  PageTitle,
  RightContent,
  SearchIcon,
  SettingsButton,
  Tag,
  TagGroup,
  TagsWrapper,
} from './styles';


export function PanelTagsConfig() {
  const inputs = useInputs();
  const outputs = useOutputs(inputs);
  const fragmentProps = { inputs, outputs };
  return (
    <TagsWrapper
      children={
        <>
          <Body
            children={
              <>
                <LeftContent
                  children={
                    <SearchFragment
                      {...fragmentProps}
                    />
                  }
                />
                <RightContent
                  children={
                    <>
                      <SynonymsFragment
                        {...fragmentProps}
                      />
                      <GroupsFragment
                        {...fragmentProps}
                      />
                      <NoResultsWrapper
                        if={!inputs.tagsInSynonymGroup.length && !inputs.tagsInCustomGroups.length}
                        children={
                          <>
                            <SearchIcon
                              if={!inputs.autocompleteText}
                            />
                            start typing to search
                          </>
                        }
                      />
                    </>
                  }
                />
              </>
            }
          />
          <Footer
            if={!!inputs.synonymId}
            children={
              <FooterButton
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
}

const SearchFragment = ({ inputs, outputs }: FragmentProps) => (
  <BodyGroup
    children={
      <>
        <BodyHeader
          children={
            <PageTitle
              children={inputs.instruction}
            />
          }
        />
        <ControlAutocomplete<AutocompleteOptionType>
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
        <OverlayConfirmation
          if={inputs.modal === 'confirmDeleteTag'}
          storeKey='deleteTag'
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
                      children={tag.text}
                      onClick={e => outputs.onClickGroupSynonym(group.id, synonymId, e)}
                      onMouseOver={() => outputs.onMouseOverGroupTag(group.id, synonymId)}
                      onMouseOut={outputs.onMouseOutGroupTag}
                      $first={tag.first}
                      $last={tag.last}
                      $selected={(inputs.hoveringGroupId === group.id && inputs.hoveringSynonymId === synonymId) || (active && inputs.groupSynonymId === synonymId)}
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
              <OverlayConfirmation
                if={inputs.modal === 'confirmDeleteGroup'}
                storeKey='deleteGroup'
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