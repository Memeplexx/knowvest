import { FlashCardDTO, GroupDTO, NoteDTO, NoteTagDTO, SynonymDTO, SynonymGroupDTO, TagDTO } from "@/server/dtos";
import { AppRouter } from "@/server/routers/_app";
import { type Note, type Tag, type NoteTag, type Group, type SynonymGroup, type Synonym, FlashCard } from "@prisma/client";
import { inferRouterInputs, inferRouterOutputs } from "@trpc/server";
import { trpcReturningEntities } from "./trpc";
import { indexedDbState } from "./constants";

export type ValueOf<T> = T[keyof T];

export type RouterInput = inferRouterInputs<AppRouter>;
export type RouterOutput = inferRouterOutputs<AppRouter>;

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

export type TrpcReturningDtos = {
  [nounKey in keyof typeof trpcReturningEntities]: typeof trpcReturningEntities[nounKey] extends Record<string, unknown> ? (
    { [endpointKey in keyof typeof trpcReturningEntities[nounKey]]
      : typeof trpcReturningEntities[nounKey][endpointKey] extends { mutate: (...args: infer Args) => Promise<infer Response> }
      ? { mutate: (...args: Args) => Promise<EntityToDto<Response>> }
      : typeof trpcReturningEntities[nounKey][endpointKey] extends { query: (...args: infer Args) => Promise<infer Response> }
      ? { query: (...args: Args) => Promise<EntityToDto<Response>> }
      : typeof trpcReturningEntities[nounKey][endpointKey] }
  ) : TrpcReturningDtos[nounKey]
}

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

