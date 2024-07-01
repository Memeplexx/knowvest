import { NoteDTO, SynonymId } from "@/actions/types";
import { NoteTags } from "@/utils/tags-worker";
import { Readable } from "olik";
import { HTMLProps } from "react";

export type Props = {
  note: NoteDTO | null,
  synonymIds: Readable<SynonymId[]>,
  groupSynonymIds?: Readable<SynonymId[]>,
  searchTerms?: Readable<NoteTags[]>,
  className?: string | undefined;
  onClick?: () => void;
} & HTMLProps<HTMLDivElement>;
