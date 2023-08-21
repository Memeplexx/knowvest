import { Note, SynonymId } from "@/server/dtos";
import { Readable } from "olik";
import { HTMLAttributes } from "react";

export type Props = {
  note: Note,
  synonymIds: Readable<SynonymId[]>,
} & HTMLAttributes<HTMLElement>;