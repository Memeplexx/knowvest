import { type FlashCard, type Group, type Note, type Synonym, type SynonymGroup, type Tag, type User } from "@prisma/client";
import { type Brand } from "olik";



export type NoteId = Brand<number, 'NoteId'>;
export type TagId = Brand<number, 'TagId'>;
export type GroupId = Brand<number, 'GroupId'>;
export type SynonymId = Brand<number, 'SynonymId'>;
export type UserId = Brand<number, 'UserId'>;
export type FlashCardId = Brand<number, 'FlashCardId'>;
export type SynonymGroupId = Brand<number, 'SynonymGroupId'>;


export interface NoteDTO extends Omit<Note, 'isArchived'> {
  id: NoteId;
  userId: UserId;
}

export interface TagDTO extends Omit<Tag, 'isArchived'> {
  id: TagId;
  userId: UserId;
  synonymId: SynonymId;
}

export interface GroupDTO extends Omit<Group, 'isArchived'> {
  id: GroupId;
  userId: UserId;
}

export interface SynonymGroupDTO extends Omit<SynonymGroup, 'isArchived'> {
  id: SynonymGroupId;
  groupId: GroupId;
  synonymId: SynonymId;
}

export interface SynonymDTO extends Omit<Synonym, 'isArchived'> {
  id: SynonymId;
}

export interface UserDTO extends Omit<User, 'isArchived'> {
  id: UserId;
}

export interface FlashCardDTO extends Omit<FlashCard, 'isArchived'> {
  id: FlashCardId;
  noteId: NoteId;
}
