import { FlashCardDTO, GroupDTO, NoteDTO, NoteId, NoteTagDTO, SynonymGroupDTO, SynonymId, TagDTO } from '@/server/dtos';
import { UseFloatingOptions, flip, size, autoUpdate } from '@floating-ui/react';
import { homeInitialState } from './pages/home/constants';
import { configInitialState } from '@/components/tags-config/constants';
import { tagsPanelInitialState } from '@/components/tags/constants';
import { activePanelInitialState } from '@/components/active/constants';
import { searchInitialState } from '@/components/search/constants';
import { navBarInitialState } from '@/components/navbar/constants';
import { createContext } from 'react';
import { Store } from 'olik';
import { flashCardInitialState } from './pages/flash_cards/constants';

export const OrderTypes = {
  Created: 'dateCreated',
  Updated: 'dateUpdated',
  Viewed: 'dateViewed',
} as const;

export const floatingUiDefaultOptions = {
  whileElementsMounted: autoUpdate,
  middleware: [
    flip({ padding: 10 }),
    size({
      apply({ rects, availableHeight, elements }) {
        Object.assign(elements.floating.style, {
          width: `${rects.reference.width}px`,
          maxHeight: `${availableHeight}px`
        });
      },
      padding: 10,
    })
  ]
} as Partial<UseFloatingOptions>;

export const initialAppState = {
  activeNoteId: 0 as NoteId,
  groups: new Array<GroupDTO>(),
  synonymGroups: new Array<SynonymGroupDTO>(),
  noteTags: new Array<NoteTagDTO>(),
  notes: new Array<NoteDTO>(),
  tags: new Array<TagDTO>(),
  flashCards: new Array<FlashCardDTO>(),
  synonymIds: new Array<SynonymId>(),
  home: homeInitialState,
  config: configInitialState,
  tagsPanel: tagsPanelInitialState,
  activePanel: activePanelInitialState,
  search: searchInitialState,
  navBar: navBarInitialState,
  flashCardPanel: flashCardInitialState,
};

export type AppState = typeof initialAppState;

export const StoreContext = createContext<Store<AppState> | undefined>(undefined);
