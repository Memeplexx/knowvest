"use client";
import { ControlAutocomplete } from '@/components/control-autocomplete';
import { Fragment } from 'react';
import { AutocompleteOptionType, FragmentProps } from './constants';
import { useInputs } from './inputs';
import { useOutputs } from './outputs';
import { AutocompleteOption, BodyGroup, BodyHeader, CategoryWrapper, Footer, FooterButton, NoResultsIcon, NoResultsWrapper, OptionLabel, OptionLabelSuffix, PageTitle, PanelSearchNotesWrapper, RemoveButton, RemoveIcon, Result, ResultsContent, SearchContent, SearchIcon, SearchPageBody, Tag, TagsOuterWrapper, TagsWrapper } from './styles';


export function PanelSearchNotes() {
  const inputs = useInputs();
  const outputs = useOutputs(inputs);
  const fragmentProps = { inputs, outputs };
  return (
    <PanelSearchNotesWrapper
      children={
        <>
          <SearchPageBody
            children={
              <>
                <SearchContent
                  if={inputs.showSearchPane}
                  children={
                    <>
                      <SearchFragment
                        {...fragmentProps}
                      />
                      <TagsOuterWrapper
                        children={
                          <>
                            <SearchTermsFragment
                              {...fragmentProps}
                            />
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
          <Footer
            if={!!inputs.notesByTags.length}
            children={
              <>
                <div
                  children={
                    <FooterButton
                      if={inputs.isMobileWidth}
                      onClick={outputs.onClickTabButton}
                      highlighted={false}
                      children={inputs.showResultsPane ? 'View search' : `View results (${inputs.notesByTags.length})`}
                      aria-label={inputs.showResultsPane ? 'View search' : 'View results'}
                    />
                  }
                />
                <FooterButton
                  onClick={outputs.onClickStartOver}
                  children='Start over'
                  aria-label='Start over'
                  title='Start a new search'
                  highlighted={true}
                />
              </>
            }
          />
        </>
      }
    />
  );
}

const SearchFragment = ({ inputs, outputs }: FragmentProps) => {
  return (
    <BodyGroup
      children={
        <>
          <BodyHeader
            children={
              <PageTitle
                children='Search Tags and Groups'
              />
            }
          />
          <ControlAutocomplete<AutocompleteOptionType>
            ref={inputs.autocompleteRef}
            options={inputs.autocompleteOptions}
            inputPlaceholder='Start typing...'
            onValueChange={outputs.onAutocompleteSelected}
            onInputTextChange={outputs.onAutocompleteInputChange}
            onInputEnterKeyUp={outputs.onAutocompleteInputEnterKeyUp}
            inputText={inputs.autocompleteText}
            onShowOptionsChange={outputs.onAutocompleteShowOptionsChange}
            showOptions={inputs.showAutocompleteOptions}
            onInputFocused={outputs.onAutocompleteInputFocused}
            renderOption={option => (
              <AutocompleteOption
                children={
                  <>
                    <OptionLabel
                      children={option.label}
                    />
                    <OptionLabelSuffix
                      children={option.count}
                    />
                  </>
                }
              />
            )}
          />
        </>
      }
    />

  )
}

const SearchTermsFragment = ({ inputs, outputs }: FragmentProps) => {
  return (
    <CategoryWrapper
      if={!!inputs.searchTerms.length}
      children={
        <>
          Search terms
          <TagsWrapper
            children={
              inputs.searchTerms.map(term => (
                <Tag
                  key={term}
                  children={term}
                  // onClick={() => outputs.onClickRemoveSearchTerm(term)}
                  $rightGap={true}
                  $hovered={false}
                  $disabled={false}
                  $rightMost={true}
                  $leftMost={true}
                />
              ))
            }
          />
        </>
      }
    />
  )
}

const SynonymsFragment = ({ inputs, outputs }: FragmentProps) => {
  return (
    <CategoryWrapper
      if={!!inputs.selectedSynonymIds.length}
      children={
        <>
          Synonyms
          <TagsWrapper
            children={
              inputs.selectedSynonymTags.map(tags => (
                <Fragment
                  key={tags[0]!.synonymId}
                  children={
                    <>
                      {tags.map((tag, index) =>
                        <Tag
                          key={tag.id}
                          $hovered={tag.synonymId === inputs.hoveredSynonymId}
                          $leftMost={index === 0}
                          $disabled={!inputs.enabledSynonymIds.includes(tag.synonymId)}
                          onMouseOver={() => outputs.onMouseOverSelectedSynonym(tag.synonymId)}
                          onMouseOut={outputs.onMouseOutSelectedSynonym}
                          onClick={outputs.onClickToggleSynonym(tag.synonymId)}
                          children={tag.text}
                        />
                      )}
                      <Tag
                        key={tags[0]!.synonymId}
                        $hovered={tags[0]!.synonymId === inputs.hoveredSynonymId}
                        $rightMost={true}
                        $disabled={false}
                        $rightGap={true}
                        onMouseOver={() => outputs.onMouseOverSelectedSynonym(tags[0]!.synonymId)}
                        onMouseOut={outputs.onMouseOutSelectedSynonym}
                        children={
                          <RemoveButton
                            onClick={() => outputs.onClickRemoveSynonym(tags[0]!.synonymId)}
                            children={<RemoveIcon />}
                          />
                        }
                      />
                    </>
                  }
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
                children={
                  <>
                    {group.synonyms.map((synonym, index) =>
                      synonym.tags.map((tag, i) => (
                        <Tag
                          key={tag.id}
                          $hovered={tag.synonymId === inputs.hoveredSynonymId}
                          $leftMost={index === 0 && i === 0}
                          $rightGap={i === synonym.tags.length - 1}
                          $disabled={!inputs.enabledSynonymIds.includes(synonym.synonymId)}
                          children={tag.text}
                          onClick={outputs.onClickToggleSynonym(synonym.synonymId)}
                          onMouseOver={() => outputs.onMouseOverSelectedSynonym(synonym.synonymId)}
                          onMouseOut={outputs.onMouseOutSelectedSynonym}
                        />
                      ))
                    )}
                    <Tag
                      key={group.groupId}
                      $hovered={group.synonyms[0]!.synonymId === inputs.hoveredSynonymId}
                      $rightMost={true}
                      $disabled={false}
                      onMouseOver={() => outputs.onMouseOverSelectedSynonym(group.synonyms[0]!.synonymId)}
                      onMouseOut={outputs.onMouseOutSelectedSynonym}
                      children={
                        <RemoveButton
                          onClick={() => outputs.onClickRemoveGroup(group.groupId)}
                          children={<RemoveIcon />}
                        />
                      }
                    />
                  </>
                }
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
    <ResultsContent
      if={inputs.showResultsPane}
      children={
        <>
          {inputs.notesByTags.map(note => (
            <Result
              key={note.id}
              note={note}
              synonymIds={inputs.local.enabledSynonymIds}
              onClick={() => outputs.onClickResult(note.id)}
            />
          ))}
          <NoResultsWrapper
            if={!inputs.notesByTags.length}
            children={
              <>
                <NoResultsIcon
                  if={!!inputs.autocompleteText}
                />
                <SearchIcon
                  if={!inputs.autocompleteText}
                />
                {inputs.autocompleteText ? 'No results found' : 'Start typing to search'}
              </>
            }
          />
        </>
      }
    />
  )
}
