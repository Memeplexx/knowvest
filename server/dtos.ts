import prismaClient from "@prisma/client";
import { Brand } from "olik";
import { ZodNumberDef, ZodType, z } from 'zod';

export type NoteId = Brand<number, 'NoteId'>;
export type TagId = Brand<number, 'TagId'>;
export type GroupId = Brand<number, 'GroupId'>;
export type SynonymId = Brand<number, 'SynonymId'>;
export type UserId = Brand<number, 'UserId'>;

export interface Note extends prismaClient.Note {
  id: NoteId;
}

export interface Tag extends prismaClient.Tag {
  id: TagId;
  synonymId: SynonymId;
}

export interface NoteTag extends prismaClient.NoteTag {
  noteId: NoteId;
  tagId: TagId;
}

export interface Group extends prismaClient.Group {
  id: GroupId;
}

export interface SynonymGroup extends prismaClient.SynonymGroup {
  groupId: GroupId;
  synonymId: SynonymId;
}

export interface Synonym extends prismaClient.Synonym {
  id: SynonymId;
}

export interface User extends prismaClient.User {
  id: UserId;
}

export const ZodNoteId = z.number() as unknown as ZodType<NoteId, ZodNumberDef>;
export const ZodTagId = z.number() as unknown as ZodType<TagId, ZodNumberDef>;
export const ZodGroupId = z.number() as unknown as ZodType<GroupId, ZodNumberDef>;
export const ZodSynonymId = z.number() as unknown as ZodType<SynonymId, ZodNumberDef>;
export const ZodUserId = z.number() as unknown as ZodType<UserId, ZodNumberDef>;