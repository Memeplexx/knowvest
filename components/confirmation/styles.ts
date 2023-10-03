import styled from "styled-components";
import { possible } from "../html";
import { Button } from "../button";


export const DialogBody = styled(possible.div)`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 32px;
`;

export const Header = styled(possible.div)`
  color: grey;
`;

export const Message = styled(possible.div)`
  font-size: 18px;
`;

export const ButtonWrapper = styled(possible.div)`
  display: flex;
  justify-content: right;
`;

export const ConfirmButton = styled(Button)`
`;

export const CancelButton = styled(Button)`
`;