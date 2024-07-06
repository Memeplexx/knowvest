"use client"
import { store } from "@/utils/store-utils";
import { BiLogOutCircle } from "react-icons/bi";
import { CiSettings } from "react-icons/ci";
import { FiEdit } from "react-icons/fi";
import { GrConfigure } from "react-icons/gr";
import { IoSearch } from "react-icons/io5";
import { MdHistory } from "react-icons/md";
import { PiPlugsConnectedFill, PiStudentFill } from "react-icons/pi";
import { ContainerWithStickyHeader } from "../container-with-sticky-header";
import { Inputs } from "./constants";
import { useInputs } from "./inputs";
import { useOutputs } from "./outputs";
import { ContainerOnceLoggedInWrapper, LoaderPlaceholder, MenuContent, MenuItem, MenuItemLink, MenuItemSeparator, TopBar } from "./styles";


export function ContainerOnceLoggedIn({ children }: { children: React.ReactNode }) {
  const inputs = useInputs();
  const outputs = useOutputs(inputs);
  return (
    <>
      <LoaderPlaceholder
        if={!inputs.isReady}
      />
      <ContainerOnceLoggedInWrapper
        if={inputs.isReady}
        onShow={store.showMenu.$set}
        show={inputs.showMenu}
        size={280}
        edgeThreshold={25}
        position="left"
        menuContent={
          <MenuFragment
            inputs={inputs}
          />
        }
        mainContent={
          <ContainerWithStickyHeader
            heading={<TopBar />}
            body={children}
            ref={inputs.containerWithStickyHeaderRef}
            onScrolledToBottom={outputs.onScrolledToBottom}
          />
        }
      />
    </>
  )
}

const MenuFragment = ({ inputs }: { inputs: Inputs }) => {
  return (
    <MenuContent
      $headerHeight={inputs.containerWithStickyHeaderRef.current?.headerHeight ?? 0}
      onClick={() => store.showMenu.$set(false)}
      children={
        <>
          <MenuItemLink
            href="./home"
            $active={inputs.routerPathName === '/app/home'}
            children={
              <>
                <FiEdit />
                Active Note
              </>
            }
          />
          <MenuItemLink
            href="./related"
            $active={inputs.routerPathName === '/app/related'}
            children={
              <>
                <PiPlugsConnectedFill />
                Related Notes
              </>
            }
          />
          <MenuItemLink
            href="./history"
            $active={inputs.routerPathName === '/app/history'}
            children={
              <>
                <MdHistory />
                Note History
              </>
            }
          />
          <MenuItemSeparator />
          <MenuItemLink
            href="./search"
            $active={inputs.routerPathName === '/app/search'}
            children={
              <>
                <IoSearch />
                Search Notes
              </>
            }
          />
          <MenuItemSeparator />
          <MenuItemLink
            href="./tags"
            $active={inputs.routerPathName === '/app/tags'}
            children={
              <>
                <GrConfigure />
                Tag Manager
              </>
            }
          />
          <MenuItemLink
            href="./test"
            $active={inputs.routerPathName === '/app/test'}
            children={
              <>
                <PiStudentFill />
                Test Me
              </>
            }
          />
          <MenuItem
            children={
              <>
                <CiSettings />
                App Settings
              </>
            }
          />
          <MenuItemSeparator />
          <MenuItem
            children={
              <>
                <BiLogOutCircle />
                Sign Out
              </>
            }
          />
        </>
      }
    />
  )
}
