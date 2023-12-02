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

export const FlashCards = styled(Card)`
  flex: 1;
`;

export const FlashCardWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const FlashCard = styled.div`
  background: rgba(255,255,255,0.2);
  display: flex;
`;

export const FlashCardText = styled.textarea`
  flex: 1;
  padding: 4px;
  font-size: 14px;
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