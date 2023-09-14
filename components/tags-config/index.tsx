import { forwardRef, type ForwardedRef } from 'react';

import { Autocomplete } from '../autocomplete';
import { Modal } from '../modal';
import { useOutputs } from './outputs';
import { useInputs } from './inputs';
import {
  AutocompleteOption,
  AutocompleteOptionLabel,
  AutocompleteOptionSynonyms,
  Body,
  BodyGroup,
  BodyHeader,
  CloseButton,
  CustomGroupNameInput,
  Footer,
  FooterButton,
  ModalContent,
  PageTitle,
  SettingsButton,
  Tag,
  TagGroup,
} from './styles';
import { Confirmation } from '../confirmation';
import { AutocompleteOptionType, Props } from './constants';
import { CloseIcon, PopupOption, PopupOptions, SettingsIcon } from '@/utils/styles';


export const TagsConfig = forwardRef(function TagsConfig(
  props: Props,
  ref: ForwardedRef<HTMLDivElement>
) {
  const inputs = useInputs(ref, props);
  const outputs = useOutputs(inputs);
  const { state, refs } = inputs;
  return (
    <Modal
      show={props.show}
      children={
        <ModalContent
          ref={refs.modal}
          children={
            <>
              <Body
                children={
                  <>
                    <BodyGroup
                      children={
                        <>
                          <BodyHeader
                            children={
                              <>
                                <PageTitle
                                  children={state.pageTitle}
                                />
                                <CloseButton
                                  children={<CloseIcon />}
                                  onClick={outputs.onClickCloseButton}
                                />
                              </>
                            }
                          />
                          <Autocomplete<AutocompleteOptionType>
                            ref={refs.autocomplete}
                            options={state.autocompleteOptions}
                            inputPlaceholder='Start typing...'
                            onValueChange={outputs.onAutocompleteSelected}
                            onInputEnterKeyUp={outputs.onAutocompleteInputEnter}
                            onInputEscapeKeyUp={outputs.onAutocompleteInputCancel}
                            inputText={state.autocompleteText}
                            onInputTextChange={outputs.onAutocompleteInputChange}
                            onInputFocused={outputs.onAutocompleteInputFocused}
                            showOptions={state.showAutocompleteOptions}
                            onShowOptionsChange={outputs.onShowAutocompleteOptionsChange}
                            disabled={state.autocompleteDisabled}
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

                    <BodyGroup
                      showIf={!!state.tagsInSynonymGroup.length}
                      $active={!state.groupId}
                      children={
                        <>
                          <BodyHeader
                            children={
                              <>
                                Synonyms
                                <SettingsButton
                                  children={<SettingsIcon />}
                                  onClick={outputs.onClickShowOptionsForSynonyms}
                                  selected={state.showSynonymOptions}
                                  $show={!state.groupId}
                                  ref={refs.settingsButton}
                                  aria-label='Settings'
                                />
                              </>
                            }
                          />
                          <TagGroup
                            children={state.tagsInSynonymGroup.map(tag =>
                              <Tag
                                key={tag.id}
                                selected={tag.selected}
                                ref={tag.ref}
                                onClick={e => outputs.onClickTagSynonym(e, tag.id)}
                                children={tag.text}
                                $first={tag.first}
                                $last={tag.last}
                              />
                            )}
                          />
                          <PopupOptions
                            showIf={state.showSynonymOptions}
                            ref={refs.synonymOptions}
                            style={refs.floating.floatingStyles}
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
                                  showIf={state.allowRemoveSelectionFromSynonyms}
                                  onClick={outputs.onClickRemoveTagFromSynonyms}
                                  children='Remove selection from these Synonyms'
                                />
                                <PopupOption
                                  showIf={!!state.tagId}
                                  children='Rename selection to something else'
                                  onClick={outputs.onClickRenameTag}
                                />
                                <PopupOption
                                  showIf={!!state.tagId}
                                  onClick={outputs.onClickDeleteTag}
                                  children='Delete selection'
                                />
                              </>
                            }
                          />
                          <Confirmation
                            show={state.confirmDeleteTag}
                            onClose={outputs.onCancelConfirmation}
                            onConfirm={outputs.onClickConfirmDeleteTag}
                            title='Delete Tag Requested'
                            message='Are you sure you want to delete this tag?'
                            confirmText='Yes, Delete Tag'
                          />
                        </>
                      }
                    />

                    {state.tagsInCustomGroups.map(group => (
                      <BodyGroup
                        key={group.group.id}
                        $active={group.group.active}
                        children={
                          <>
                            <BodyHeader
                              children={
                                <>
                                  Group:
                                  <CustomGroupNameInput
                                    value={group.group.inputText}
                                    onFocus={() => outputs.onCustomGroupNameFocus(group.group.id)}
                                    onKeyUp={outputs.onCustomGroupNameKeyUp}
                                    onChange={outputs.onCustomGroupNameChange}
                                  />
                                  <SettingsButton
                                    children={<SettingsIcon />}
                                    onClick={() => outputs.onClickShowOptionsForGroup(group.group.id)}
                                    selected={state.showGroupOptions}
                                    $show={group.group.active}
                                    ref={group.group.settingsRef}
                                    aria-label='Settings'
                                  />
                                </>
                              }
                            />
                            <TagGroup
                              children={group.synonyms.map(synonym => (
                                synonym.tags.map(tag => (
                                  <Tag
                                    key={tag.id}
                                    ref={tag.ref}
                                    selected={tag.selected}
                                    children={tag.text}
                                    $first={tag.first}
                                    $last={tag.last}
                                    onClick={e => outputs.onClickGroupSynonym(e, group.group.id, synonym.synonymId)}
                                    onMouseOver={() => outputs.onMouseOverGroupTag(group.group.id, synonym.synonymId)}
                                    onMouseOut={outputs.onMouseOutGroupTag}
                                  />
                                ))
                              ))}
                            />
                            <PopupOptions
                              showIf={group.group.showOptions}
                              ref={group.group.popupRef}
                              style={refs.floating.floatingStyles}
                              onClick={outputs.onClickHideOptionsForGroup}
                              children={
                                <>
                                  <PopupOption
                                    onClick={outputs.onClickAddSynonymToCustomGroup}
                                    children='Add to this Group'
                                  />
                                  <PopupOption
                                    showIf={group.group.canRemoveSelection}
                                    onClick={outputs.onClickRemoveSynonymFromCustomGroup}
                                    children='Remove selection from Group'
                                  />
                                  <PopupOption
                                    showIf={group.group.canUpdateSelection}
                                    onClick={outputs.onClickUpdateGroupSynonym}
                                    children='Update selection'
                                  />
                                  <PopupOption
                                    onClick={outputs.onClickDeleteGroup}
                                    children='Delete this Group'
                                  />
                                </>
                              }
                            />
                            <Confirmation
                              show={state.confirmDeleteGroup}
                              onClose={outputs.onCancelConfirmation}
                              onConfirm={outputs.onClickConfirmDeleteGroup}
                              title='Delete Group Requested'
                              message='Are you sure you want to delete this group?'
                              confirmText='Yes, Delete Group'
                            />
                          </>
                        }
                      />
                    ))}
                  </>
                }
              />
              <Footer
                children={
                  <FooterButton
                    onClick={outputs.onClickStartOver}
                    showIf={!!state.synonymId}
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
      }
    />
  );
});

