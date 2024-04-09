import { NoteDTO, SynonymId } from "@/actions/types";
import { Readable } from "olik";
import { HTMLProps } from "react";

export type Props = {
  note: NoteDTO | null,
  synonymIds: Readable<SynonymId[]>,
  className?: string | undefined;
  onClick?: () => void;
  showIf?: boolean;
} & HTMLProps<HTMLDivElement>;
