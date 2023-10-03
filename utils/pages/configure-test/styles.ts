import { defaultFontFamily } from "@/utils/styles";
import styled from "styled-components";

export const Container = styled.div`
  width: 100vw;
  height: 100%;
  display: flex;
  flex-direction: column;
  ${defaultFontFamily.style};
  background-color: black;
`;