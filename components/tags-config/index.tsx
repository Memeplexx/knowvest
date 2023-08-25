import { forwardRef, ForwardedRef } from 'react';

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
                                <div
                                  children={state.autocompleteTitle}
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
                                      children={o.synonyms.filter(s => o.value !== s.id).map(s => s.text).join(' | ')}
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
                                  selected={state.modal === 'synonymOptions'}
                                  $show={!state.groupId}
                                  ref={state.modal === 'synonymOptions' ? refs.floating.refs.setReference : null}
                                  aria-label='Settings'
                                />
                              </>
                            }
                          />
                          <TagGroup
                            children={state.tagsInSynonymGroup.map((tag, i) =>
                              <Tag
                                key={tag.id}
                                selected={tag.id === state.tagId}
                                ref={tag.id === state.tagId ? refs.selectedTag : null}
                                onClick={e => outputs.onClickTagSynonym(e, tag.id)}
                                children={state.tagId === tag.id || (!state.tagId && state.tagId === tag.id) ? state.autocompleteText : tag.text}
                                $first={!i}
                                $last={i === state.tagsInSynonymGroup.length - 1}
                              />
                            )}
                          />
                          <PopupOptions
                            showIf={state.modal === 'synonymOptions'}
                            ref={state.modal === 'synonymOptions' ? refs.floating.refs.setFloating : null}
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
                                  showIf={!!state.tagId && state.tagsInSynonymGroup.length > 1}
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
                            show={state.modal === 'confirmDeleteTag'}
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
                        $active={state.groupId === group.group.id}
                        children={
                          <>
                            <BodyHeader
                              children={
                                <>
                                  Group:
                                  <CustomGroupNameInput
                                    value={state.groupId === group.group.id ? state.focusedGroupNameInputText : group.group.name}
                                    onFocus={() => outputs.onCustomGroupNameFocus(group.group.id)}
                                    onKeyUp={outputs.onCustomGroupNameKeyUp}
                                    onChange={outputs.onCustomGroupNameChange}
                                  />
                                  <SettingsButton
                                    children={<SettingsIcon />}
                                    onClick={() => outputs.onClickShowOptionsForGroup(group.group.id)}
                                    selected={state.modal === 'groupOptions'}
                                    $show={state.groupId === group.group.id}
                                    ref={state.groupId === group.group.id && state.modal === 'groupOptions' ? refs.floating.refs.setReference : null}
                                    aria-label='Settings'
                                  />
                                </>
                              }
                            />
                            <TagGroup
                              children={group.synonyms.map(synonym => (
                                synonym.tags.map((tag, i) => (
                                  <Tag
                                    key={tag}
                                    ref={state.groupId === group.group.id && state.groupSynonymId === synonym.synonymId ? refs.selectedTag : null}
                                    selected={
                                      (state.hoveringGroupId === group.group.id && state.hoveringSynonymId === synonym.synonymId) ||
                                      (state.groupId === group.group.id && state.groupSynonymId === synonym.synonymId)}
                                    onClick={e => outputs.onClickGroupSynonym(e, group.group.id, synonym.synonymId)}
                                    children={tag}
                                    $first={!i}
                                    $last={i === synonym.tags.length - 1}
                                    onMouseOver={() => outputs.onMouseOverGroupTag(group.group.id, synonym.synonymId)}
                                    onMouseOut={outputs.onMouseOutGroupTag}
                                  />
                                ))
                              ))}
                            />
                            <PopupOptions
                              showIf={state.groupId === group.group.id && state.modal === 'groupOptions'}
                              ref={state.groupId === group.group.id && state.modal === 'groupOptions' ? refs.floating.refs.setFloating : null}
                              style={refs.floating.floatingStyles}
                              onClick={outputs.onClickHideOptionsForGroup}
                              children={
                                <>
                                  <PopupOption
                                    onClick={outputs.onClickAddSynonymToCustomGroup}
                                    children='Add to this Group'
                                  />
                                  <PopupOption
                                    showIf={!!state.groupSynonymId && group.synonyms.length > 1}
                                    onClick={outputs.onClickRemoveSynonymFromCustomGroup}
                                    children='Remove selection from Group'
                                  />
                                  <PopupOption
                                    showIf={!!state.groupSynonymId && state.groupSynonymId !== state.synonymId}
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
                              show={state.modal === 'confirmDeleteGroup'}
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
                    aria-label="Start over"
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

