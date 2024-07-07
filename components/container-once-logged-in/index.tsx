"use client"
import { routes } from "@/utils/app-utils";
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
            href={routes.home}
            $active={inputs.routerPathName === routes.home}
            children={
              <>
                <FiEdit />
                Active Note
              </>
            }
          />
          <MenuItemLink
            href={routes.related}
            $active={inputs.routerPathName === routes.related}
            children={
              <>
                <PiPlugsConnectedFill />
                Related Notes
              </>
            }
          />
          <MenuItemLink
            href={routes.previous}
            $active={inputs.routerPathName === routes.previous}
            children={
              <>
                <MdHistory />
                Previous Notes
              </>
            }
          />
          <MenuItemSeparator />
          <MenuItemLink
            href={routes.search}
            $active={inputs.routerPathName === routes.search}
            children={
              <>
                <IoSearch />
                Search
              </>
            }
          />
          <MenuItemSeparator />
          <MenuItemLink
            href={routes.tags}
            $active={inputs.routerPathName === routes.tags}
            children={
              <>
                <GrConfigure />
                Tags
              </>
            }
          />
          <MenuItemLink
            href={routes.test}
            $active={inputs.routerPathName === routes.test}
            children={
              <>
                <PiStudentFill />
                Test
              </>
            }
          />
          <MenuItem
            children={
              <>
                <CiSettings />
                Settings
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
