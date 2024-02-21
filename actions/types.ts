import { type Note, type Tag, type NoteTag, type Group, type SynonymGroup, type Synonym, type FlashCard, type User } from "@prisma/client";
import { type Brand } from "olik";

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

export type NoteId = Brand<number, 'NoteId'>;
export type TagId = Brand<number, 'TagId'>;
export type GroupId = Brand<number, 'GroupId'>;
export type SynonymId = Brand<number, 'SynonymId'>;
export type UserId = Brand<number, 'UserId'>;
export type FlashCardId = Brand<number, 'FlashCardId'>;
export type NotTagId = Brand<number, 'NotTagId'>;
export type SynonymGroupId = Brand<number, 'SynonymGroupId'>;

type BrandedDto<T, P extends Partial<T>> = {
  [key in keyof T]: P[key] extends number ? P[key] : T[key];
};

export type NoteDTO = BrandedDto<Note, {
  id: NoteId,
  userId: UserId,
}>;

export type TagDTO = BrandedDto<Tag, {
  id: TagId;
  synonymId: SynonymId;
  userId: UserId;
}>;

export type NoteTagDTO = BrandedDto<NoteTag, {
  id: NotTagId;
  noteId: NoteId;
  tagId: TagId;
}>

export type GroupDTO = BrandedDto<Group, {
  id: GroupId;
  userId: UserId;
}>

export type SynonymGroupDTO = BrandedDto<SynonymGroup, {
  id: SynonymGroupId;
  groupId: GroupId;
  synonymId: SynonymId;
}>

export type SynonymDTO = BrandedDto<Synonym, {
  id: SynonymId;
}>

export type UserDTO = BrandedDto<User, {
  id: UserId;
}>

export type FlashCardDTO = BrandedDto<FlashCard, {
  id: FlashCardId;
  noteId: NoteId;
  note?: NoteDTO;
}>
