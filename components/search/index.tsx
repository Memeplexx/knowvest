import { type ForwardedRef, forwardRef, Fragment } from 'react';
import { Autocomplete } from '../autocomplete';
import { AutocompleteOptionType, Props } from './constants';
import { useOutputs } from './outputs';
import { useInputs } from './inputs';
import { AutocompleteOption, AutocompleteOptionStatus, AutocompleteOptionLabel, AutocompleteOptionLeft, Container, CategoryTitle, CategoryWrapper, LeftContent, Result, RightContent, Tag, TagsOuterWrapper, TagsWrapper, MainContent, TabsWrapper, TabTitle, TabButton, CloseButton, TabsButtons } from './styles';
import { CloseIcon } from '@/utils/styles';


export const SearchDialog = forwardRef(function SearchDialog(
  props: Props,
  ref: ForwardedRef<HTMLDivElement>
) {
  const inputs = useInputs(ref, props);
  const outputs = useOutputs(inputs);
  return (
    <Container
      ref={inputs.bodyRef}
      children={
        <>
          <TabsWrapper
            showIf={inputs.screenIsNarrow}
            children={
              <>
                <TabTitle
                  children={inputs.tabTitleText}
                />
                <TabsButtons
                  children={
                    <>
                      <TabButton
                        children={inputs.tabButtonText}
                        onClick={outputs.onClickTabButton}
                        aria-label={inputs.tabButtonText}
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
                  showIf={inputs.showSearchPane}
                  children={
                    <>
                      <Autocomplete<AutocompleteOptionType>
                        ref={inputs.autocompleteRef}
                        options={inputs.autocompleteOptions}
                        inputPlaceholder='Search Tags and Groups'
                        onValueChange={outputs.onAutocompleteSelected}
                        onInputTextChange={outputs.onAutocompleteInputChange}
                        inputText={inputs.autocompleteText}
                        onShowOptionsChange={outputs.onAutocompleteShowOptionsChange}
                        showOptions={inputs.showAutocompleteOptions}
                        onInputFocused={outputs.onAutocompleteInputFocused}
                        renderOption={option => (
                          <AutocompleteOption
                            children={
                              <>
                                <AutocompleteOptionLeft
                                  children={
                                    <>
                                      <AutocompleteOptionStatus
                                        children={option.selected ? '✓' : ' '}
                                      />
                                      <AutocompleteOptionLabel
                                        children={option.label}
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
                                      inputs.selectedSynonymTags.map(tags => (
                                        <Fragment
                                          key={tags[0].synonymId}
                                          children={
                                            <>
                                              {tags.map(tag =>
                                                <Tag
                                                  key={tag.id}
                                                  $hovered={tag.synonymId === inputs.hoveredSynonymId}
                                                  onClick={outputs.onClickSelectedSynonym(tag.synonymId)}
                                                  children={tag.text}
                                                  $first={tag.first}
                                                  $last={tag.last}
                                                  onMouseOver={outputs.onMouseOverSelectedSynonym(tag.synonymId)}
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
                            {inputs.selectedGroupTags.map(group => (
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
                                            $hovered={tag.synonymId === inputs.hoveredSynonymId}
                                            children={tag.text}
                                            $first={tag.first}
                                            $last={tag.last}
                                            onClick={outputs.onClickSelectedGroup(group.groupId)}
                                            onMouseOver={outputs.onMouseOverSelectedSynonym(tag.synonymId)}
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
                  showIf={inputs.showResultsPane}
                  children={inputs.notesByTags.map(note => (
                    <Result
                      key={note.id}
                      note={note}
                      synonymIds={inputs.store.search.selectedSynonymIds}
                      onClick={outputs.onClickResult(note.id)}
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

