import { monoFontFamily } from "@/utils/style-utils";
import styled from "styled-components";
import { div } from "../control-conditional";


export const PanelNoteReadonlyWrapper = styled(div)`
  ${monoFontFamily.style};
  font-size: 12px;
  padding-left: 0px;
  filter: brightness(0.8);
  font-weight: 300;
`;

