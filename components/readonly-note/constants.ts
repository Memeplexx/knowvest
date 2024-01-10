import { NoteDTO, SynonymId } from "@/server/dtos";
import { Readable } from "olik";
import { HTMLProps } from "react";

export type Props = {
  note?: NoteDTO,
  synonymIds: Readable<SynonymId[]>,
  className?: string | undefined;
  onClick?: () => void;
} & HTMLProps<HTMLDivElement>;