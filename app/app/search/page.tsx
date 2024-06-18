"use client";
import { Autocomplete } from '@/components/autocomplete';
import { Fragment } from 'react';
import { AutocompleteOptionType, FragmentProps } from './constants';
import { useInputs } from './inputs';
import { useOutputs } from './outputs';
import { AutocompleteOption, BodyGroup, BodyHeader, CategoryWrapper, Footer, FooterButton, LeftContent, NoResultsIcon, NoResultsWrapper, OptionLabel, OptionLabelSuffix, PageTitle, RemoveButton, RemoveIcon, Result, RightContent, SearchIcon, SearchWrapper, TabButton, TabTitle, TabsButtons, TabsWrapper, Tag, TagsOuterWrapper, TagsWrapper } from './styles';


export default function Page() {
  const inputs = useInputs();
  const outputs = useOutputs(inputs);
  const fragmentProps = { inputs, outputs };
  return (
    <>
      <TabsFragment
        {...fragmentProps}
      />
      <SearchWrapper
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
      <Footer
        if={!!inputs.notesByTags.length}
        children={
          <FooterButton
            onClick={outputs.onClickStartOver}
            children='Start over'
            aria-label='Start over'
            title='Manage a new tag'
            highlighted={true}
          />
        }
      />
    </>
  );
}

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
          <Autocomplete<AutocompleteOptionType>
            ref={inputs.autocompleteRef}
            options={inputs.autocompleteOptions}
            inputPlaceholder='Start typing...'
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
    <RightContent
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
