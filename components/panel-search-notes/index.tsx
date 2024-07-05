"use client";
import { ControlAutocomplete } from '@/components/control-autocomplete';
import { Fragment } from 'react';
import { AutocompleteOptionType, FragmentProps } from './constants';
import { useInputs } from './inputs';
import { useOutputs } from './outputs';
import { AutocompleteOption, BodyGroup, BodyHeader, CategoryWrapper, Footer, FooterButton, Header, Icon, NoResultsIcon, NoResultsWrapper, OptionLabel, OptionLabelSuffix, PageTitle, PanelSearchNotesWrapper, RemoveButton, RemoveIcon, Result, ResultWrapper, ResultsContent, SearchContent, SearchIcon, SearchPageBody, Tag, TagsOuterWrapper, TagsWrapper } from './styles';


export const PanelSearchNotes = () => {
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
                      highlighted={false}
                      children={inputs.showResultsPane ? 'View search' : `View results (${inputs.notesFound.length})`}
                      aria-label={inputs.showResultsPane ? 'View search' : 'View results'}
                      onClick={outputs.onClickTabButton.bind(this)}
                    />
                  }
                />
                <FooterButton
                  onClick={outputs.onClickStartOver.bind(this)}
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
                children='Search for Tags, Groups, or any text'
              />
            }
          />
          <ControlAutocomplete<AutocompleteOptionType>
            ref={inputs.autocompleteRef}
            options={inputs.autocompleteOptions}
            inputText={inputs.autocompleteText}
            showOptions={inputs.showAutocompleteOptions}
            inputPlaceholder='Start typing...'
            onValueChange={outputs.onAutocompleteSelected.bind(this)}
            onInputTextChange={outputs.onAutocompleteInputChange.bind(this)}
            onInputEnterKeyUp={outputs.onAutocompleteInputEnterKeyUp.bind(this)}
            onShowOptionsChange={outputs.onAutocompleteShowOptionsChange.bind(this)}
            onInputClicked={outputs.onAutocompleteInputFocused.bind(this)}
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
                        $type='searchTerm'
                        $rightGap={false}
                        $hovered={term === inputs.hoveredSearchTerm}
                        $disabled={!inputs.enabledSearchTerms.includes(term)}
                        $rightMost={false}
                        $leftMost={true}
                        onMouseOut={outputs.onMouseOutSearchTerm.bind(this)}
                        onMouseOver={outputs.onMouseOverSearchTerm.bind(this, term)}
                        onClick={outputs.onClickToggleSearchTerm.bind(this, term)}
                      />
                      <Tag
                        $type='searchTerm'
                        $hovered={term === inputs.hoveredSearchTerm}
                        $rightMost={true}
                        $rightGap={true}
                        $disabled={!inputs.enabledSearchTerms.includes(term)}
                        onMouseOver={outputs.onMouseOverSearchTerm.bind(this, term)}
                        onMouseOut={outputs.onMouseOutSearchTerm.bind(this)}
                        children={
                          <RemoveButton
                            onClick={outputs.onClickRemoveSearchTerm.bind(this, term)}
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
                          onMouseOver={outputs.onMouseOverSynonym.bind(this, tag.synonymId)}
                          onMouseOut={outputs.onMouseOutSynonym.bind(this)}
                          onClick={outputs.onClickToggleSynonym.bind(this, tag.synonymId)}
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
                        onMouseOver={outputs.onMouseOverSynonym.bind(this, tags[0]!.synonymId)}
                        onMouseOut={outputs.onMouseOutSynonym.bind(this)}
                        children={
                          <RemoveButton
                            onClick={outputs.onClickRemoveSynonym.bind(this, tags[0]!.synonymId)}
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
                          onClick={outputs.onClickToggleGroup.bind(this, group.groupId)}
                          onMouseOver={outputs.onMouseOverGroup.bind(this, group.groupId)}
                          onMouseOut={outputs.onMouseOutGroup.bind(this)}
                        />
                      ))
                    )}
                    <Tag
                      key={group.groupId}
                      $hovered={group.groupId === inputs.hoveredGroupId}
                      $rightMost={true}
                      $disabled={false}
                      $type='group'
                      onMouseOver={outputs.onMouseOverGroup.bind(this, group.groupId)}
                      onMouseOut={outputs.onMouseOutGroup.bind(this)}
                      children={
                        <RemoveButton
                          onClick={outputs.onClickRemoveGroup.bind(this, group.groupId)}
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
                    onClick={outputs.onClickResult.bind(this, note.note.id)}
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
