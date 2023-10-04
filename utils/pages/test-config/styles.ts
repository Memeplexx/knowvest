import { Card } from "@/components/card";
import { defaultFontFamily } from "@/utils/styles";
import styled from "styled-components";

export const Container = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  ${defaultFontFamily.style};
  background-color: black;
  gap: 4px;
`;

export const Editor = styled(Card)`
  flex: 1;
`;

export const Questions = styled(Card)`
  flex: 1;
`;

export const Wrapper = styled.div`
  min-height: 0;
  width: 100vw;
  height: 100%;
  display: flex;
  gap: 4px;
  margin: 4px;
  margin-top: 0;
`;