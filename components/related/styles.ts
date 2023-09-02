import styled from "styled-components";
import { possible } from "../html";
import { Loader } from "../loader";

export const NoteCount = styled(possible.div)`
  font-size: 12px;
`;

export const Loading = styled(Loader)`
  margin: 0 -16px;
`;