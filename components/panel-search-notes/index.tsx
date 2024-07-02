"use client";
import { ControlAutocomplete } from '@/components/control-autocomplete';
import { Fragment } from 'react';
import { AutocompleteOptionType, FragmentProps } from './constants';
import { useInputs } from './inputs';
import { useOutputs } from './outputs';
import { AutocompleteOption, BodyGroup, BodyHeader, CategoryWrapper, Footer, FooterButton, Header, Icon, NoResultsIcon, NoResultsWrapper, OptionLabel, OptionLabelSuffix, PageTitle, PanelSearchNotesWrapper, RemoveButton, RemoveIcon, Result, ResultWrapper, ResultsContent, SearchContent, SearchIcon, SearchPageBody, Tag, TagsOuterWrapper, TagsWrapper } from './styles';


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
            if={!!inputs.notesFound.length}
            children={
              <>
                <div
                  children={
                    <FooterButton
                      if={inputs.isMobileWidth}
                      onClick={outputs.onClickTabButton}
                      highlighted={false}
                      children={inputs.showResultsPane ? 'View search' : `View results (${inputs.notesFound.length})`}
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
            onInputClicked={outputs.onAutocompleteInputFocused}
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
      if={!!inputs.selectedSearchTerms.length}
      children={
        <>
          Search terms
          <TagsWrapper
            children={
              inputs.selectedSearchTerms.distinct().map(term => (
                <Fragment
                  key={term}
                  children={
                    <>
                      <Tag
                        children={term}
                        onClick={outputs.onClickToggleSearchTerm(term)}
                        $rightGap={false}
                        $hovered={term === inputs.hoveredSearchTerm}
                        $disabled={!inputs.enabledSearchTerms.includes(term)}
                        $rightMost={false}
                        $leftMost={true}
                        onMouseOver={outputs.onMouseOverSearchTerm(term)}
                        onMouseOut={outputs.onMouseOutSearchTerm}
                        $type='searchTerm'
                      />
                      <Tag
                        $type='searchTerm'
                        $hovered={term === inputs.hoveredSearchTerm}
                        $rightMost={true}
                        $disabled={false}
                        $rightGap={true}
                        onMouseOver={outputs.onMouseOverSearchTerm(term)}
                        onMouseOut={outputs.onMouseOutSearchTerm}
                        children={
                          <RemoveButton
                            onClick={outputs.onClickRemoveSearchTerm(term)}
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
                          onMouseOver={outputs.onMouseOverSynonym(tag.synonymId)}
                          onMouseOut={outputs.onMouseOutSynonym}
                          onClick={outputs.onClickToggleSynonym(tag.synonymId)}
                          $type='synonym'
                          children={tag.text}
                        />
                      )}
                      <Tag
                        key={tags[0]!.synonymId}
                        $hovered={tags[0]!.synonymId === inputs.hoveredSynonymId}
                        $rightMost={true}
                        $disabled={false}
                        $rightGap={true}
                        $type='synonym'
                        onMouseOver={outputs.onMouseOverSynonym(tags[0]!.synonymId)}
                        onMouseOut={outputs.onMouseOutSynonym}
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
                          $hovered={group.groupId === inputs.hoveredGroupId}
                          $leftMost={index === 0 && i === 0}
                          $rightGap={i === synonym.tags.length - 1}
                          $disabled={!inputs.enabledGroupIds.includes(group.groupId)}
                          children={tag.text}
                          $type='group'
                          onClick={outputs.onClickToggleGroup(group.groupId)}
                          onMouseOver={outputs.onMouseOverGroup(group.groupId)}
                          onMouseOut={outputs.onMouseOutGroup}
                        />
                      ))
                    )}
                    <Tag
                      key={group.groupId}
                      $hovered={group.groupId === inputs.hoveredGroupId}
                      $rightMost={true}
                      $disabled={false}
                      $type='group'
                      onMouseOver={outputs.onMouseOverGroup(group.groupId)}
                      onMouseOut={outputs.onMouseOutGroup}
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
          {inputs.notesFound.map(note => (
            <ResultWrapper
              key={note.note.id}
              children={
                <>
                  <Header
                    children={
                      <>
                        {note.matches}
                        <Icon />
                      </>
                    }
                  />
                  <Result
                    note={note.note}
                    synonymIds={inputs.local.enabledSynonymIds}
                    groupSynonymIds={inputs.enabledGroupSynonymIds}
                    searchTerms={inputs.local.searchResults}
                    onClick={() => outputs.onClickResult(note.note.id)}
                  />
                </>
              }
            />
          ))}
          <NoResultsWrapper
            if={!inputs.notesFound.length}
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
