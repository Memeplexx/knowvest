import { type Group, type Note, type Tag, type NoteTag, type SynonymGroup, type Synonym, type User, Question } from "@prisma/client";
import { Brand } from "olik";
import { z, type ZodNumberDef, type ZodType } from 'zod';

export type NoteId = Brand<number, 'NoteId'>;
export type TagId = Brand<number, 'TagId'>;
export type GroupId = Brand<number, 'GroupId'>;
export type SynonymId = Brand<number, 'SynonymId'>;
export type UserId = Brand<number, 'UserId'>;

export interface NoteDTO extends Note {
  id: NoteId;
}

export interface TagDTO extends Tag {
  id: TagId;
  synonymId: SynonymId;
  userId: UserId;
}

export interface NoteTagDTO extends NoteTag {
  noteId: NoteId;
  tagId: TagId;
}

export interface GroupDTO extends Group {
  id: GroupId;
}

export interface SynonymGroupDTO extends SynonymGroup {
  groupId: GroupId;
  synonymId: SynonymId;
}

export interface SynonymDTO extends Synonym {
  id: SynonymId;
}

export interface UserDTO extends User {
  id: UserId;
}

export interface QuestionDTO extends Question {
  noteId: NoteId;
}

export const ZodNoteId = z.number() as unknown as ZodType<NoteId, ZodNumberDef>;
export const ZodTagId = z.number() as unknown as ZodType<TagId, ZodNumberDef>;
export const ZodGroupId = z.number() as unknown as ZodType<GroupId, ZodNumberDef>;
export const ZodSynonymId = z.number() as unknown as ZodType<SynonymId, ZodNumberDef>;
export const ZodUserId = z.number() as unknown as ZodType<UserId, ZodNumberDef>;