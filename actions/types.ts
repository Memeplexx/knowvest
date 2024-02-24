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


export interface NoteDTO extends Note {
  id: NoteId;
  userId: UserId;
}

export interface TagDTO extends Tag {
  id: TagId;
  userId: UserId;
  synonymId: SynonymId;
}

export interface NoteTagDTO extends NoteTag {
  id: NoteTagId;
  noteId: NoteId;
  tagId: TagId;
}

export interface GroupDTO extends Group {
  id: GroupId;
  userId: UserId;
}

export interface SynonymGroupDTO extends SynonymGroup {
  id: SynonymGroupId;
  groupId: GroupId;
  synonymId: SynonymId;
}

export interface SynonymDTO extends Synonym {
  id: SynonymId;
}

export interface UserDTO extends User {
  id: UserId;
}

export interface FlashCardDTO extends FlashCard {
  id: FlashCardId;
  noteId: NoteId;
}
