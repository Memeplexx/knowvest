import { HTMLAttributes } from "react";

export type Props = {
  selection: string;
  onClickCreateNewTag: () => void;
  onClickSplitNote: () => void;
  onClickFilterNotes: () => void;
} & HTMLAttributes<HTMLDivElement>;