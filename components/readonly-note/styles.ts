import styled from "styled-components";


export const Wrapper = styled.div`
  ${p => p.theme.fontFamily.mono.style};
  font-size: ${p => p.theme.fontSize.sm};
  padding-left: 0px;
  filter: brightness(0.8);
  font-weight: ${p => p.theme.fontWeight.textEditor};
`;

