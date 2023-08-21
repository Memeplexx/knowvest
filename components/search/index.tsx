import { ForwardedRef, forwardRef, Fragment } from 'react';
import { Autocomplete } from '../autocomplete';
import { Modal } from '../modal';
import { AutocompleteOptionType, Props } from './constants';
import { useEvents } from './events';
import { useHooks } from './hooks';
import { AutocompleteOption, AutocompleteOptionStatus, AutocompleteOptionLabel, AutocompleteOptionLeft, Body, CategoryTitle, CategoryWrapper, LeftContent, Result, RightContent, Tag, TagsOuterWrapper, TagsWrapper, MainContent, TabsWrapper, TabTitle, TabButton } from './styles';


export const SearchDialog = forwardRef(function SearchDialog(
  props: Props,
  ref: ForwardedRef<HTMLDivElement>
) {
  const state = useHooks(ref, props);
  const events = useEvents(state);
  return (
    <Modal
      show={props.show}
      children={
        <Body
          ref={state.bodyRef}
          children={
            <>
              <TabsWrapper
                showIf={state.screenIsNarrow}
                children={
                  <>
                    <TabTitle
                      children={state.tabTitleText}
                    />
                    <TabButton
                      children={state.tabButtonText}
                      onClick={events.onClickTabButton}
                    />
                  </>
                }
              />
              <MainContent
                children={
                  <>
                    <LeftContent
                      showIf={state.showSearchPane}
                      children={
                        <>
                          <Autocomplete<AutocompleteOptionType>
                            ref={state.autocompleteRef}
                            options={state.autocompleteOptions}
                            inputPlaceholder='Search Tags and Groups'
                            onValueChange={events.onAutocompleteSelected}
                            onInputTextChange={events.onAutocompleteInputChange}
                            inputText={state.autocompleteText}
                            onShowOptionsChange={events.onAutocompleteShowOptionsChange}
                            showOptions={state.showAutocompleteOptions}
                            onInputFocused={events.onAutocompleteInputFocused}
                            renderOption={o => (
                              <AutocompleteOption
                                children={
                                  <>
                                    <AutocompleteOptionLeft
                                      children={
                                        <>
                                          <AutocompleteOptionStatus
                                            children={o.selected ? '✓' : ' '}
                                          />
                                          <AutocompleteOptionLabel
                                            children={o.label}
                                          />
                                        </>
                                      }
                                    />
                                    <div></div>
                                  </>
                                }
                              />
                            )}
                          />
                          <TagsOuterWrapper
                            children={
                              <>
                                <CategoryWrapper
                                  children={
                                    <>
                                      <CategoryTitle
                                        children='Synonyms'
                                      />
                                      <TagsWrapper
                                        children={
                                          state.selectedSynonymTags.map(tags => (
                                            <Fragment
                                              key={tags[0].synonymId}
                                              children={
                                                <>
                                                  {tags.map((tag, i) =>
                                                    <Tag
                                                      key={tag.id}
                                                      $hovered={tag.synonymId === state.hoveredSynonymId}
                                                      onClick={() => events.onClickSelectedSynonym(tag.synonymId)}
                                                      children={tag.text}
                                                      $first={!i}
                                                      $last={i === tags.length - 1}
                                                      onMouseOver={() => events.onMouseOverSelectedSynonym(tag.synonymId)}
                                                      onMouseOut={events.onMouseOutSelectedSynonym}
                                                    />
                                                  )}
                                                </>
                                              }
                                            />
                                          ))
                                        }
                                      />
                                    </>
                                  }
                                />
                                {state.selectedGroupTags.map(group => (
                                  <CategoryWrapper
                                    key={group.groupId}
                                    children={
                                      <>
                                        <CategoryTitle
                                          children={group.name}
                                        />
                                        <TagsWrapper
                                          children={group.synonyms.map(synonym =>
                                            synonym.tags.map((tag, i) => (
                                              <Tag
                                                key={tag.id}
                                                $hovered={tag.synonymId === state.hoveredSynonymId}
                                                onClick={() => events.onClickSelectedGroup(group.groupId)}
                                                children={tag.text}
                                                $first={!i}
                                                $last={i === synonym.tags.length - 1}
                                                onMouseOver={() => events.onMouseOverSelectedSynonym(tag.synonymId)}
                                                onMouseOut={events.onMouseOutSelectedSynonym}
                                              />
                                            ))
                                          )}
                                        />
                                      </>
                                    }
                                  />
                                ))}
                              </>
                            }
                          />
                        </>
                      }
                    />
                    <RightContent
                      showIf={state.showResultsPane}
                      children={state.notesByTags.map(note => (
                        <Result
                          key={note.id}
                          note={note}
                          synonymIds={state.store.selectedSynonymIds}
                          onClick={() => events.onClickResult(note.id)}
                        />
                      ))}
                    />
                  </>
                }
              />
            </>
          }
        />
      }
    />
  );
});

