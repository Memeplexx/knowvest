import styled from "styled-components";

export const Wrapper = styled.div`
  width: 100vw;
  height: 100vh;
  background-image: url(images/backdrop-red.svg);
  background-size: cover;
  display: flex;
  justify-content: center;
  align-items: center;
  letter-spacing: 4px;
  ${p => p.theme.fontFamily.default.style};
`;

export const Title = styled.h1`
  font-size: 18px;
`;

export const SubTitle = styled.h2`
  font-size: 16px;
  color: black;
`;

export const CenterContent = styled.div`
  display: flex;
  gap: 8px;
  flex-direction: column;
  align-items: center;
`;

export const Divider = styled.div`
  height: 1px;
  background-color: #FFF;
  align-self: normal;
`;

export const ProviderButton = styled.button`
  background-color: rgba(0,0,0,0.1);
  padding: 8px 16px;
  cursor: pointer;
  transform: scale(1);
  transition: all 0.4s;
  :hover {
    background-color: rgba(0,0,0,0.2);
  }
`;