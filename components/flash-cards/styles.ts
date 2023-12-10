import { possible } from "@/components/html";
import styled from "styled-components";
import { ButtonIcon } from "../button-icon";


export const Container = styled.div`
  flex: 1;
`;

export const CreateNewButton = styled(ButtonIcon)`
  position: absolute;
  top: 16px;
  right: 16px;
  z-index: 4;
`;

export const FlashCardWrapper = styled(possible.div)`
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
  &::placeholder {
    color: grey;
  }
`;

export const NoResults = styled(possible.div)`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  color: grey;
`;