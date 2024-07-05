"use client";
import { ControlAutocomplete } from '@/components/control-autocomplete';
import { OverlayConfirmation } from '@/components/overlay-confirmation';
import { PopupOption, PopupOptions } from '@/utils/style-utils';
import { CiSettings } from 'react-icons/ci';
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
  PanelTagsConfigWrapper,
  RightContent,
  SearchIcon,
  SettingsButton,
  Tag,
  TagGroup,
} from './styles';


export const PanelTagsConfig = () => {
  const inputs = useInputs();
  const outputs = useOutputs(inputs);
  const fragmentProps = { inputs, outputs };
  return (
    <PanelTagsConfigWrapper
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
                onClick={outputs.onClickStartOver.bind(this)}
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
          onValueChange={outputs.onAutocompleteSelected.bind(this)}
          onInputEnterKeyUp={outputs.onAutocompleteInputEnter.bind(this)}
          onInputEscapeKeyUp={outputs.onAutocompleteInputCancel.bind(this)}
          onInputTextChange={outputs.onAutocompleteInputChange.bind(this)}
          onInputClicked={outputs.onAutocompleteInputFocused.bind(this)}
          onShowOptionsChange={outputs.onShowAutocompleteOptionsChange.bind(this)}
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
                children={<CiSettings />}
                selected={inputs.modal === 'synonymOptions'}
                aria-label='Settings'
                $show={!inputs.groupId}
                ref={inputs.settingsButtonRef}
                onClick={outputs.onClickShowOptionsForSynonyms.bind(this)}
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
              onClick={outputs.onClickTagSynonym.bind(this, tag.id)}
            />
          )}
        />
        <PopupOptions
          if={inputs.modal === 'synonymOptions'}
          ref={inputs.synonymOptionsRef}
          style={inputs.floatingRef.floatingStyles}
          onClick={outputs.onClickHideOptionsForSynonyms.bind(this)}
          children={
            <>
              <PopupOption
                onClick={outputs.onClickAddNewTagToSynonymGroup.bind(this)}
                children='Add to these Synonyms'
              />
              <PopupOption
                onClick={outputs.onClickAddCurrentSynonymsToExistingGroup.bind(this)}
                children='Add these Synonyms to Group'
              />
              <PopupOption
                if={!!inputs.tagId && inputs.tagsInSynonymGroup.length > 1}
                onClick={outputs.onClickRemoveTagFromSynonyms.bind(this)}
                children='Remove selection from these Synonyms'
              />
              <PopupOption
                if={!!inputs.tagId}
                children='Rename selection to something else'
                onClick={outputs.onClickRenameTag.bind(this)}
              />
              <PopupOption
                if={!!inputs.tagId}
                onClick={outputs.onClickConfirmDeleteTag.bind(this)}
                children='Delete selection'
              />
            </>
          }
        />
        <OverlayConfirmation
          if={inputs.modal === 'confirmDeleteTag'}
          storeKey='deleteTag'
          onClose={outputs.onCancelConfirmation.bind(this)}
          onConfirm={outputs.onClickConfirmArchiveTag.bind(this)}
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
                      onFocus={outputs.onCustomGroupNameFocus.bind(this, group.id)}
                      onBlur={outputs.onCustomGroupNameBlur.bind(this, group.id)}
                      onKeyUp={outputs.onCustomGroupNameKeyUp.bind(this)}
                      onChange={outputs.onCustomGroupNameChange.bind(this)}
                    />
                    <SettingsButton
                      children={<CiSettings />}
                      onClick={outputs.onClickShowOptionsForGroup.bind(this, group.id)}
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
                      onClick={outputs.onClickGroupSynonym.bind(this, group.id, synonymId)}
                      onMouseOver={outputs.onMouseOverGroupTag.bind(this, group.id, synonymId)}
                      onMouseOut={outputs.onMouseOutGroupTag.bind(this)}
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
                onClick={outputs.onClickHideOptionsForGroup.bind(this)}
                children={
                  <>
                    <PopupOption
                      children='Add to this Group'
                      onClick={outputs.onClickAddSynonymToCustomGroup.bind(this)}
                    />
                    <PopupOption
                      if={!!inputs.groupSynonymId && synonyms.length > 1}
                      children='Remove selection from Group'
                      onClick={outputs.onClickRemoveSynonymFromCustomGroup.bind(this)}
                    />
                    <PopupOption
                      if={!!inputs.groupSynonymId && inputs.groupSynonymId !== inputs.synonymId}
                      children='Update selection'
                      onClick={outputs.onClickUpdateGroupSynonym.bind(this)}
                    />
                    <PopupOption
                      children='Delete this Group'
                      onClick={outputs.onClickDeleteGroup.bind(this)}
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
                onClose={outputs.onCancelConfirmation.bind(this)}
                onConfirm={outputs.onClickConfirmArchiveGroup.bind(this)}
              />
            </>
          }
        />
      ))
    }
  </>
);