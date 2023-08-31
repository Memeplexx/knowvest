import { NoteDTO, SynonymId } from "@/server/dtos";
import { Readable } from "olik";

export type Props = {
  note: NoteDTO,
  synonymIds: Readable<SynonymId[]>,
  className?: string | undefined;
  onClick?: () => void;
}