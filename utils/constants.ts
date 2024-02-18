import { UseFloatingOptions, flip, size, autoUpdate } from '@floating-ui/react';
import { createContext } from 'react';
import { Store } from 'olik';
import { NoteDTO, TagDTO, NoteTagDTO, GroupDTO, SynonymGroupDTO, FlashCardDTO, NoteId, SynonymId } from './types';

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

export type AppState = typeof initialAppState;

export const StoreContext = createContext<Store<AppState> | undefined>(undefined);

export const indexedDbState = {
  tags: new Array<TagDTO>(),
  notes: new Array<NoteDTO>(),
  noteTags: new Array<NoteTagDTO>(),
  groups: new Array<GroupDTO>(),
  synonymGroups: new Array<SynonymGroupDTO>(),
  flashCards: new Array<FlashCardDTO>(),
}

export const initialAppState = {
  ...indexedDbState,
  activeNoteId: 0 as NoteId,
  synonymIds: new Array<SynonymId>(),
  stateInitialized: false,
};



