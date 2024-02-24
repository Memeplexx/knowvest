import { type Note, type Tag, type NoteTag, type Group, type SynonymGroup, type Synonym, type FlashCard, type User } from "@prisma/client";
import { type Brand } from "olik";



export type NoteId = Brand<number, 'NoteId'>;
export type TagId = Brand<number, 'TagId'>;
export type GroupId = Brand<number, 'GroupId'>;
export type SynonymId = Brand<number, 'SynonymId'>;
export type UserId = Brand<number, 'UserId'>;
export type FlashCardId = Brand<number, 'FlashCardId'>;
export type NoteTagId = Brand<number, 'NoteTagId'>;
export type SynonymGroupId = Brand<number, 'SynonymGroupId'>;

type BrandedDto<T, P extends Partial<T>> = {
  [key in keyof T]: P[key] extends Brand<number, string> ? P[key] : T[key];
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
  id: NoteTagId;
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
