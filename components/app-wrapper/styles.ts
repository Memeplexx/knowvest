import styled from "styled-components";
import { div } from "../html";
import { Loader } from "../loader";
import { SideNav } from "../sidenav";

export const LoaderPlaceholder = styled(Loader)`
  flex: 1;
  z-index: 9;
  background-image: linear-gradient(to right, #242020, #191919);
`;

export const AppWrapperWrapper = styled(div)`
  flex: 1;
  max-height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

export const Inner = styled(div)`
  flex: 1;
  display: flex;
  overflow: hidden;
  position: relative;
`;

export const Drawer = styled(SideNav)`
`;

export const Menu = styled.div`
  color: black;
`;
