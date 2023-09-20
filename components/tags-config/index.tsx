import { forwardRef, type ForwardedRef } from 'react';

import { Autocomplete } from '../autocomplete';
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
  Container,
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
    <Container
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
                        disabled={!!state.groupSynonymId}
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
                              selected={state.modal === 'synonymOptions'}
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
                            ref={tag.id === state.tagId ? refs.selectedTag : null}
                            onClick={e => outputs.onClickTagSynonym(e, tag.id)}
                            children={tag.text}
                            $first={tag.first}
                            $last={tag.last}
                          />
                        )}
                      />
                      <PopupOptions
                        showIf={state.modal === 'synonymOptions'}
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
                        showIf={state.modal === 'confirmDeleteTag'}
                        onClose={outputs.onCancelConfirmation}
                        onConfirm={outputs.onClickConfirmDeleteTag}
                        title='Delete Tag Requested'
                        message='Are you sure you want to delete this tag?'
                        confirmText='Yes, Delete Tag'
                      />
                    </>
                  }
                />

                {state.tagsInCustomGroups
                  .map(e => ({ ...e, active: state.groupId === e.group.id }))
                  .map(({ group, synonyms, active }) => (
                    <BodyGroup
                      key={group.id}
                      $active={active}
                      children={
                        <>
                          <BodyHeader
                            children={
                              <>
                                Group:
                                <CustomGroupNameInput
                                  value={active ? state.focusedGroupNameInputText : group.name}
                                  onFocus={() => outputs.onCustomGroupNameFocus(group.id)}
                                  onBlur={() => outputs.onCustomGroupNameBlur(group.id)}
                                  onKeyUp={outputs.onCustomGroupNameKeyUp}
                                  onChange={outputs.onCustomGroupNameChange}
                                />
                                <SettingsButton
                                  children={<SettingsIcon />}
                                  onClick={() => outputs.onClickShowOptionsForGroup(group.id)}
                                  selected={state.modal === 'groupOptions'}
                                  $show={active}
                                  ref={active && state.modal === 'groupOptions' ? refs.floating.refs.setReference : null}
                                  aria-label='Settings'
                                />
                              </>
                            }
                          />
                          <TagGroup
                            children={synonyms.map(({ synonymId, tags }) => (
                              tags.map((tag, index, array) => (
                                <Tag
                                  key={tag.id}
                                  ref={active && state.groupSynonymId === state.synonymId ? refs.selectedTag : null}
                                  selected={(state.hoveringGroupId === group.id && state.hoveringSynonymId === synonymId) || (active && state.groupSynonymId === synonymId)}
                                  children={tag.text}
                                  $first={index === 0}
                                  $last={index === array.length - 1}
                                  onClick={e => outputs.onClickGroupSynonym(e, group.id, synonymId)}
                                  onMouseOver={() => outputs.onMouseOverGroupTag(group.id, synonymId)}
                                  onMouseOut={outputs.onMouseOutGroupTag}
                                />
                              ))
                            ))}
                          />
                          <PopupOptions
                            showIf={active && state.modal === 'groupOptions'}
                            ref={active && state.modal === 'groupOptions' ? refs.floating.refs.setFloating : null}
                            style={refs.floating.floatingStyles}
                            onClick={outputs.onClickHideOptionsForGroup}
                            children={
                              <>
                                <PopupOption
                                  onClick={outputs.onClickAddSynonymToCustomGroup}
                                  children='Add to this Group'
                                />
                                <PopupOption
                                  showIf={!!state.groupSynonymId && synonyms.length > 1}
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
                            showIf={state.modal === 'confirmDeleteGroup'}
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
  );
});

