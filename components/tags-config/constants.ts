import { SynonymId, TagId, GroupId } from "@/actions/types";
import { useInputs } from "./inputs";
import { useOutputs } from "./outputs";

export const initialState = {
  tagsConfig: {
    /**
       * `addActiveSynonymsToAGroup` Whether the user is adding the currently selected synonym to a group  
       * `addSynonymsToActiveGroup` Whether the user is adding synonyms to the currently selected group  
       * `addSynonymsToActiveSynonyms` Whether the user is adding more synonyms to the currently selected synonyms
       */
    autocompleteAction: null as 'addActiveSynonymsToAGroup' | 'addSynonymsToActiveGroup' | 'addSynonymsToActiveSynonyms' | null,
    /**
     * `confirmDeleteGroup` Whether the confirmation dialog to delete a group is open  
     * `confirmDeleteTag` Whether the confirmation dialog to delete a tag is open  
     * `synonymOptions` Whether the synonym options popup is showing  
     * `groupOptions` Whether the group options popup is showing
     */
    modal: null as 'confirmDeleteGroup' | 'confirmDeleteTag' | 'synonymOptions' | 'groupOptions' | null,
    /**
     * The ID of the tag that was selected via the autocomplete
     */
    synonymId: null as null | SynonymId,
    /**
     * The ID of the tag that was selected after the synonymId was selected
     */
    tagId: null as null | TagId,
    /**
     * The ID of the group that was selected after the synonymId was selected
     */
    groupId: null as null | GroupId,
    /**
     * The selected synonym ID in the custom group
     */
    groupSynonymId: null as null | SynonymId,
    /**
     * The text displayed in the autocomplete input
     */
    autocompleteText: '',
    /**
     * The text being displayed in the group name input while it is being edited
     */
    focusedGroupNameInputText: '',

    showAutocompleteOptions: false,
    autocompleteValue: null as null | GroupId | TagId,
    hoveringGroupId: null as null | GroupId,
    hoveringSynonymId: null as null | SynonymId,
  }
};

export type Props = {
  onHide: () => void,
};

export type Inputs = ReturnType<typeof useInputs>;

export type Outputs = ReturnType<typeof useOutputs>;

export type FragmentProps = { inputs: Inputs, outputs: Outputs };

export type AutocompleteOptionType = {
  value: TagId | GroupId | null,
  label: string,
  synonyms: string,
};

