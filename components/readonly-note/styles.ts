import { monoFontFamily } from "@/utils/styles";
import styled from "styled-components";
import { possible } from "../html";


export const Wrapper = styled(possible.div)`
  ${monoFontFamily.style};
  font-size: 12px;
  padding-left: 0px;
  filter: brightness(0.8);
  font-weight: 300;
`;

