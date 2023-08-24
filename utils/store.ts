import { activePanelInitialState } from "@/components/active/constants";
import { configInitialState } from "@/components/tags-config/constants";
import { tagsPanelInitialState } from "@/components/tags/constants";
import { createStore } from "olik";
import { Group, Note, NoteId, NoteTag, SynonymGroup, SynonymId, Tag } from "@/server/dtos";
import { homeInitialState } from "./pages/home/constants";
import { searchInitialState } from "@/components/search/constants";
import { navBarInitialState } from "@/components/navbar/constants";

export const store = createStore({
  activeNoteId: 0 as NoteId,
  groups: new Array<Group>(),
  synonymGroups: new Array<SynonymGroup>(),
  noteTags: new Array<NoteTag>(),
  notes: new Array<Note>(),
  tags: new Array<Tag>(),
  synonymIds: new Array<SynonymId>(),
  home: homeInitialState,
  config: configInitialState,
  tagsPanel: tagsPanelInitialState,
  activePanel: activePanelInitialState,
  search: searchInitialState,
  navBar: navBarInitialState,
})
