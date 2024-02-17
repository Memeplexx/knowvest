import { FlashCardDTO, GroupDTO, NoteDTO, NoteTagDTO, SynonymDTO, SynonymGroupDTO, TagDTO } from "@/server/dtos";
import { type Note, type Tag, type NoteTag, type Group, type SynonymGroup, type Synonym, FlashCard } from "@prisma/client";
import { indexedDbState } from "./constants";

export type ValueOf<T> = T[keyof T];

export type OrderBy = 'dateCreated' | 'dateUpdated' | 'dateViewed';

export type EntityToDto<T>
  = T extends Note ? NoteDTO
  : T extends FlashCard ? FlashCardDTO
  : T extends Tag ? TagDTO
  : T extends NoteTag ? NoteTagDTO
  : T extends Group ? GroupDTO
  : T extends SynonymGroup ? SynonymGroupDTO
  : T extends Synonym ? SynonymDTO
  : T extends Array<infer E> ? Array<EntityToDto<E>>
  : T extends { [key: string]: unknown } ? { [key in keyof T]: EntityToDto<T[key]> }
  : T

export type DecisionResult<X, H> = X extends (string | number | boolean | symbol | Record<string, unknown>) ? X : H;

export type EventMap<T> = T extends 'click' ? MouseEvent : T extends 'keyup' | 'keydown' ? TypedKeyboardEvent<HTMLElement> : never;

export type Keys =
  | 'Backspace'
  | 'Tab'
  | 'Enter'
  | 'Shift'
  | 'Control'
  | 'Alt'
  | 'CapsLock'
  | 'Escape'
  | 'Space'
  | 'PageUp'
  | 'PageDown'
  | 'End'
  | 'Home'
  | 'ArrowLeft'
  | 'ArrowUp'
  | 'ArrowRight'
  | 'ArrowDown'
  | 'Insert'
  | 'Delete';

export interface TypedKeyboardEvent<T extends HTMLElement> extends React.KeyboardEvent<T> {
  key: Keys,
  target: T,
}

export type WriteToIndexedDBArgs = Partial<{ [tableName in keyof typeof indexedDbState]: null | typeof indexedDbState[tableName] | typeof indexedDbState[tableName][0] }>;

