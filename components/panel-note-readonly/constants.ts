import { NoteDTO, SynonymId } from "@/actions/types";
import { NoteSearchResults } from "@/utils/text-search-utils";
import { Readable } from "olik";
import { HTMLProps } from "react";

export type Props = {
  note: NoteDTO | null,
  synonymIds: Readable<SynonymId[]>,
  groupSynonymIds?: Readable<SynonymId[]>,
  searchResults?: Readable<NoteSearchResults[]>,
  className?: string | undefined;
  onClick?: () => void;
} & HTMLProps<HTMLDivElement>;
