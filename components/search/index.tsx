import { type ForwardedRef, forwardRef, Fragment } from 'react';
import { Autocomplete } from '../autocomplete';
import { AutocompleteOptionType, Props } from './constants';
import { useOutputs } from './outputs';
import { useInputs } from './inputs';
import { AutocompleteOption, AutocompleteOptionStatus, AutocompleteOptionLabel, AutocompleteOptionLeft, Container, CategoryTitle, CategoryWrapper, LeftContent, Result, RightContent, Tag, TagsOuterWrapper, TagsWrapper, MainContent, TabsWrapper, TabTitle, TabButton, CloseButton, TabsButtons } from './styles';
import { store } from '@/utils/store';
import { CloseIcon } from '@/utils/styles';


export const SearchDialog = forwardRef(function SearchDialog(
  props: Props,
  ref: ForwardedRef<HTMLDivElement>
) {
  const inputs = useInputs(ref, props);
  const outputs = useOutputs(inputs);
  const { state, refs } = inputs;
  return (
    <Container
      ref={refs.body}
      children={
        <>
          <TabsWrapper
            showIf={state.screenIsNarrow}
            children={
              <>
                <TabTitle
                  children={state.tabTitleText}
                />
                <TabsButtons
                  children={
                    <>
                      <TabButton
                        children={state.tabButtonText}
                        onClick={outputs.onClickTabButton}
                        aria-label={state.tabButtonText}
                        highlighted={false}
                      />
                      <CloseButton
                        children={<CloseIcon />}
                        onClick={outputs.onClickCloseButton}
                        aria-label='Close'
                      />
                    </>
                  }
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
                        ref={refs.autocomplete}
                        options={state.autocompleteOptions}
                        inputPlaceholder='Search Tags and Groups'
                        onValueChange={outputs.onAutocompleteSelected}
                        onInputTextChange={outputs.onAutocompleteInputChange}
                        inputText={state.autocompleteText}
                        onShowOptionsChange={outputs.onAutocompleteShowOptionsChange}
                        showOptions={state.showAutocompleteOptions}
                        onInputFocused={outputs.onAutocompleteInputFocused}
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
                                <div/>
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
                                              {tags.map(tag =>
                                                <Tag
                                                  key={tag.id}
                                                  $hovered={tag.synonymId === state.hoveredSynonymId}
                                                  onClick={() => outputs.onClickSelectedSynonym(tag.synonymId)}
                                                  children={tag.text}
                                                  $first={tag.first}
                                                  $last={tag.last}
                                                  onMouseOver={() => outputs.onMouseOverSelectedSynonym(tag.synonymId)}
                                                  onMouseOut={outputs.onMouseOutSelectedSynonym}
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
                                        synonym.tags.map(tag => (
                                          <Tag
                                            key={tag.id}
                                            $hovered={tag.synonymId === state.hoveredSynonymId}
                                            children={tag.text}
                                            $first={tag.first}
                                            $last={tag.last}
                                            onClick={() => outputs.onClickSelectedGroup(group.groupId)}
                                            onMouseOver={() => outputs.onMouseOverSelectedSynonym(tag.synonymId)}
                                            onMouseOut={outputs.onMouseOutSelectedSynonym}
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
                      synonymIds={store.search.selectedSynonymIds}
                      onClick={() => outputs.onClickResult(note.id)}
                    />
                  ))}
                />
              </>
            }
          />
        </>
      }
    />
  );
});

