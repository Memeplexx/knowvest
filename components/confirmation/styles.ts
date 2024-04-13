import styled from "styled-components";
import { Button } from "../button";
import { div } from "../html";


export const DialogBody = styled(div)`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 32px;
`;

export const Header = styled(div)`
  color: grey;
`;

export const Message = styled(div)`
  font-size: 18px;
`;

export const ButtonWrapper = styled(div)`
  display: flex;
  justify-content: right;
`;

export const ConfirmButton = styled(Button)`
`;

export const CancelButton = styled(Button)`
`;