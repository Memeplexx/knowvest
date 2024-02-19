import { SynonymId, GroupId } from "@/actions/types";
import { useInputs } from "./inputs";


export type Inputs = ReturnType<typeof useInputs>;

export type Props = {
  onHide: () => void,
};

export type SearchResultType = 'synonym' | 'group';

export type AutocompleteIdType = SynonymId | GroupId;

export const dialogWidth = 900;

export const tabsHeight = '64px';

export type AutocompleteOptionType = {
  id: AutocompleteIdType,
  value: string | null,
  label: string,
  type: SearchResultType,
  selected: boolean,
};

export const initialState = {
  search: {
    autocompleteText: '',
    selectedSynonymIds: new Array<SynonymId>(),
    selectedGroupIds: new Array<GroupId>(),
    showingTab: 'search' as 'search' | 'results',
    showSearchPane: true,
    showResultsPane: true,
    screenIsNarrow: false,
    hoveredSynonymId: null as SynonymId | null,
    showAutocompleteOptions: false,
  }
}
