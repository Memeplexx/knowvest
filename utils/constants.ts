import { FlashCardDTO, GroupDTO, NoteDTO, NoteId, NoteTagDTO, SynonymGroupDTO, SynonymId, TagDTO } from '@/server/dtos';
import { UseFloatingOptions, flip, size, autoUpdate } from '@floating-ui/react';
import { Context, createContext, useContext, useMemo } from 'react';
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

export const initialAppState = {
  activeNoteId: 0 as NoteId,
  groups: new Array<GroupDTO>(),
  synonymGroups: new Array<SynonymGroupDTO>(),
  noteTags: new Array<NoteTagDTO>(),
  notes: new Array<NoteDTO>(),
  tags: new Array<TagDTO>(),
  synonymIds: new Array<SynonymId>(),
  flashCardsForTest: new Array<FlashCardDTO>(),
};

export type AppState = typeof initialAppState;

export const StoreContext = createContext<Store<AppState> | undefined>(undefined);

export const useContextForNestedStore = <S extends object>(initialState: S) => {
  const store = useContext(StoreContext as unknown as Context<Store<AppState & S>>);
  useMemo(() => store.$setNew(initialState), []);
  return store;
}
