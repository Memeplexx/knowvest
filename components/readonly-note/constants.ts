import { Note, SynonymId } from "@/server/dtos";
import { Readable } from "olik";

export type Props = {
  note: Note,
  synonymIds: Readable<SynonymId[]>,
  className?: string | undefined;
  onClick?: () => void;
}