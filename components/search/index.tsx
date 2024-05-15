"use client";
import { CloseIcon } from '@/utils/style-utils';
import { Fragment, forwardRef, type ForwardedRef } from 'react';
import { Autocomplete } from '../autocomplete';
import { AutocompleteOptionType, Props, FragmentProps } from './constants';
import { useInputs } from './inputs';
import { useOutputs } from './outputs';
import { AutocompleteOption, CategoryWrapper, CloseButton, Container, LeftContent, MainContent, Result, RightContent, TabButton, TabTitle, TabsButtons, TabsWrapper, Tag, TagsOuterWrapper, TagsWrapper } from './styles';


export const SearchDialog = forwardRef(function SearchDialog(
  props: Props,
  ref: ForwardedRef<HTMLDivElement>
) {
  const inputs = useInputs(ref);
  const outputs = useOutputs(props, inputs);
  const fragmentProps = { inputs, outputs };
  return (
    <Container
      ref={inputs.bodyRef}
      children={
        <>
          <TabsFragment
            {...fragmentProps}
          />
          <MainContent
            children={
              <>
                <LeftContent
                  if={inputs.showSearchPane}
                  children={
                    <>
                      <SearchFragment
                        {...fragmentProps}
                      />
                      <TagsOuterWrapper
                        children={
                          <>
                            <SynonymsFragment
                              {...fragmentProps}
                            />
                            <GroupsFragment
                              {...fragmentProps}
                            />
                          </>
                        }
                      />
                    </>
                  }
                />
                <ResultsFragment
                  {...fragmentProps}
                />
              </>
            }
          />
        </>
      }
    />
  );
});

const TabsFragment = ({ inputs, outputs }: FragmentProps) => {
  return (
    <TabsWrapper
      if={inputs.screenIsNarrow}
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
  )
}

const SearchFragment = ({ inputs, outputs }: FragmentProps) => {
  return (
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
          $selected={option.selected}
          children={option.label}
        />
      )}
    />
  )
}

const SynonymsFragment = ({ inputs, outputs }: FragmentProps) => {
  return (
    <CategoryWrapper
      children={
        <>
          Synonyms
          <TagsWrapper
            children={
              inputs.selectedSynonymTags.map(tags => (
                <Fragment
                  key={tags[0]!.synonymId}
                  children={tags.map(tag =>
                    <Tag
                      key={tag.id}
                      $hovered={tag.synonymId === inputs.hoveredSynonymId}
                      onClick={() => outputs.onClickSelectedSynonym(tag.synonymId)}
                      children={tag.text}
                      $first={tag.first}
                      $last={tag.last}
                      onMouseOver={() => outputs.onMouseOverSelectedSynonym(tag.synonymId)}
                      onMouseOut={outputs.onMouseOutSelectedSynonym}
                    />
                  )}
                />
              ))
            }
          />
        </>
      }
    />
  )
};

const GroupsFragment = ({ inputs, outputs }: FragmentProps) => {
  return (
    <>
      {inputs.selectedGroupTags.map(group => (
        <CategoryWrapper
          key={group.groupId}
          children={
            <>
              {group.name}
              <TagsWrapper
                children={group.synonyms.map(synonym =>
                  synonym.tags.map(tag => (
                    <Tag
                      key={tag.id}
                      $hovered={tag.synonymId === inputs.hoveredSynonymId}
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
  )
};

const ResultsFragment = ({ inputs, outputs }: FragmentProps) => {
  return (
    <RightContent
      if={inputs.showResultsPane}
      children={inputs.notesByTags.map(note => (
        <Result
          key={note.id}
          note={note}
          synonymIds={inputs.localStore.selectedSynonymIds}
          onClick={() => outputs.onClickResult(note.id)}
        />
      ))}
    />
  )
}
