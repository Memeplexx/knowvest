import { activePanelInitialState } from "@/components/active/constants";
import { configInitialState } from "@/components/tags-config/constants";
import { tagsPanelInitialState } from "@/components/tags/constants";
import { createStore } from "olik";
import { GroupDTO, NoteDTO, NoteId, NoteTagDTO, SynonymGroupDTO, SynonymId, TagDTO } from "@/server/dtos";
import { homeInitialState } from "./pages/home/constants";
import { searchInitialState } from "@/components/search/constants";
import { navBarInitialState } from "@/components/navbar/constants";

export const store = createStore({
  activeNoteId: 0 as NoteId,
  groups: new Array<GroupDTO>(),
  synonymGroups: new Array<SynonymGroupDTO>(),
  noteTags: new Array<NoteTagDTO>(),
  notes: new Array<NoteDTO>(),
  tags: new Array<TagDTO>(),
  synonymIds: new Array<SynonymId>(),
  home: homeInitialState,
  config: configInitialState,
  tagsPanel: tagsPanelInitialState,
  activePanel: activePanelInitialState,
  search: searchInitialState,
  navBar: navBarInitialState,
})
