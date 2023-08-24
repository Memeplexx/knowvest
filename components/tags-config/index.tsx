import { forwardRef, ForwardedRef } from 'react';

import { Autocomplete } from '../autocomplete';
import { Modal } from '../modal';
import { useEvents } from './events';
import { useHooks } from './hooks';
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
  ModalContent,
  SettingsButton,
  Tag,
  TagGroup,
} from './styles';
import { Confirmation } from '../confirmation';
import { AutocompleteOptionType, Props } from './constants';
import { PopupOption, PopupOptions, SettingsIcon } from '@/utils/styles';


export const TagsConfig = forwardRef(function TagsConfig(
  props: Props,
  ref: ForwardedRef<HTMLDivElement>
) {
  const hooks = useHooks(ref, props);
  const events = useEvents(hooks);
  const { state, refs } = hooks;
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
                            children={state.autocompleteTitle}
                          />
                          <Autocomplete<AutocompleteOptionType>
                            ref={refs.autocomplete}
                            options={state.autocompleteOptions}
                            inputPlaceholder='Start typing...'
                            onValueChange={events.onAutocompleteSelected}
                            onInputEnterKeyUp={events.onAutocompleteInputEnter}
                            onInputEscapeKeyUp={events.onAutocompleteInputCancel}
                            inputText={state.autocompleteText}
                            onInputTextChange={events.onAutocompleteInputChange}
                            onInputFocused={events.onAutocompleteInputFocused}
                            showOptions={state.showAutocompleteOptions}
                            onShowOptionsChange={events.onShowAutocompleteOptionsChange}
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
                                  onClick={events.onClickShowOptionsForSynonyms}
                                  selected={state.modal === 'synonymOptions'}
                                  $show={!state.groupId}
                                  ref={state.modal === 'synonymOptions' ? refs.floating.refs.setReference : null}
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
                                onClick={e => events.onClickTagSynonym(e, tag.id)}
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
                            onClick={events.onClickHideOptionsForSynonyms}
                            children={
                              <>
                                <PopupOption
                                  onClick={events.onClickAddNewTagToSynonymGroup}
                                  children='Add to these Synonyms'
                                />
                                <PopupOption
                                  onClick={events.onClickAddCurrentSynonymsToExistingGroup}
                                  children='Add these Synonyms to Group'
                                />
                                <PopupOption
                                  showIf={!!state.tagId && state.tagsInSynonymGroup.length > 1}
                                  onClick={events.onClickRemoveTagFromSynonyms}
                                  children='Remove selection from these Synonyms'
                                />
                                <PopupOption
                                  showIf={!!state.tagId}
                                  children='Rename selection to something else'
                                  onClick={events.onClickRenameTag}
                                />
                                <PopupOption
                                  showIf={!!state.tagId}
                                  onClick={events.onClickDeleteTag}
                                  children='Delete selection'
                                />
                              </>
                            }
                          />
                          <Confirmation
                            show={state.modal === 'confirmDeleteTag'}
                            onClose={events.onCancelConfirmation}
                            onConfirm={events.onClickConfirmDeleteTag}
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
                                    onFocus={() => events.onCustomGroupNameFocus(group.group.id)}
                                    onKeyUp={events.onCustomGroupNameKeyUp}
                                    onChange={events.onCustomGroupNameChange}
                                  />
                                  <SettingsButton
                                    children={<SettingsIcon />}
                                    onClick={() => events.onClickShowOptionsForGroup(group.group.id)}
                                    selected={state.modal === 'groupOptions'}
                                    $show={state.groupId === group.group.id}
                                    ref={state.groupId === group.group.id && state.modal === 'groupOptions' ? refs.floating.refs.setReference : null}
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
                                    onClick={e => events.onClickGroupSynonym(e, group.group.id, synonym.synonymId)}
                                    children={tag}
                                    $first={!i}
                                    $last={i === synonym.tags.length - 1}
                                    onMouseOver={() => events.onMouseOverGroupTag(group.group.id, synonym.synonymId)}
                                    onMouseOut={events.onMouseOutGroupTag}
                                  />
                                ))
                              ))}
                            />
                            <PopupOptions
                              showIf={state.groupId === group.group.id && state.modal === 'groupOptions'}
                              ref={state.groupId === group.group.id && state.modal === 'groupOptions' ? refs.floating.refs.setFloating : null}
                              style={refs.floating.floatingStyles}
                              onClick={events.onClickHideOptionsForGroup}
                              children={
                                <>
                                  <PopupOption
                                    onClick={events.onClickAddSynonymToCustomGroup}
                                    children='Add to this Group'
                                  />
                                  <PopupOption
                                    showIf={!!state.groupSynonymId && group.synonyms.length > 1}
                                    onClick={events.onClickRemoveSynonymFromCustomGroup}
                                    children='Remove selection from Group'
                                  />
                                  <PopupOption
                                    showIf={!!state.groupSynonymId && state.groupSynonymId !== state.synonymId}
                                    onClick={events.onClickUpdateGroupSynonym}
                                    children='Update selection'
                                  />
                                  <PopupOption
                                    onClick={events.onClickDeleteGroup}
                                    children='Delete this Group'
                                  />
                                </>
                              }
                            />
                            <Confirmation
                              show={state.modal === 'confirmDeleteGroup'}
                              onClose={events.onCancelConfirmation}
                              onConfirm={events.onClickConfirmDeleteGroup}
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
                    onClick={events.onClickStartOver}
                    showIf={!!state.synonymId}
                    children='Start over'
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

