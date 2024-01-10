import { NoteDTO } from "@/server/dtos";
import { HTMLProps } from "react";

export type Props = {
  note?: NoteDTO,
  className?: string | undefined;
  onClick?: () => void;
} & HTMLProps<HTMLDivElement>;