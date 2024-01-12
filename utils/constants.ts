import { FlashCardDTO, GroupDTO, NoteDTO, NoteId, NoteTagDTO, SynonymGroupDTO, SynonymId, TagDTO } from '@/server/dtos';
import { UseFloatingOptions, flip, size, autoUpdate } from '@floating-ui/react';
import { createContext } from 'react';
import { Store } from 'olik';

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

export const StoreContext = createContext<{ store: Store<AppState>, notesSorted: NoteDTO[] } | undefined>(undefined);

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
};


interface NotificationContextType {
  error: (message: string) => void;
  success: (message: string) => void;
  info: (message: string) => void;
}

export const NotificationContext = createContext<NotificationContextType | undefined>(undefined);
