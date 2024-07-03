import { GroupId, SynonymId } from "@/actions/types";
import { NoteTags } from "@/utils/text-search-utils";
import { useInputs } from "./inputs";
import { useOutputs } from "./outputs";


export type Inputs = ReturnType<typeof useInputs>;

export type Outputs = ReturnType<typeof useOutputs>;

export type FragmentProps = { inputs: Inputs, outputs: Outputs };

export type SearchResultType = 'synonym' | 'group';

export type AutocompleteIdType = SynonymId | GroupId;

export const dialogWidth = 900;

export type AutocompleteOptionType = {
  id: AutocompleteIdType,
  value: string | null,
  label: string,
  count: number,
  type: SearchResultType,
};

export const initialState = {
  autocompleteText: '',
  selectedSynonymIds: new Array<SynonymId>(),
  enabledSynonymIds: new Array<SynonymId>(),
  selectedGroupIds: new Array<GroupId>(),
  enabledGroupIds: new Array<GroupId>(),
  selectedSearchTerms: new Array<string>(),
  enabledSearchTerms: new Array<string>(),
  showingPane: 'search' as 'search' | 'results',
  showSearchPane: true,
  showResultsPane: true,
  screenIsNarrow: false,
  hoveredSynonymId: null as SynonymId | null,
  hoveredGroupId: null as GroupId | null,
  hoveredSearchTerm: null as string | null,
  showAutocompleteOptions: false,
  searchResults: new Array<NoteTags>(),
}
