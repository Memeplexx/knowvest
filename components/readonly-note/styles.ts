import { monoFontFamily } from "@/utils/style-utils";
import styled from "styled-components";
import { div } from "../html";


export const ReadonlyNoteWrapper = styled(div)`
  ${monoFontFamily.style};
  font-size: 12px;
  padding-left: 0px;
  filter: brightness(0.8);
  font-weight: 300;
`;

