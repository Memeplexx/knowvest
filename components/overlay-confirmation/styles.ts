import styled from "styled-components";
import { ControlButtonFancy } from "../control-button-fancy";
import { div } from "../control-conditional";
import { OverlayModal } from "../overlay-modal";


export const OverlayConfirmationWrapper = styled(OverlayModal)`
`;

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

export const ConfirmButton = styled(ControlButtonFancy)`
`;

export const CancelButton = styled(ControlButtonFancy)`
`;