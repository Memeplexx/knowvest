"use client";
import '@/utils/polyfills';
import { useComponent } from '@/utils/react-utils';
import { PopupOption } from '@/utils/style-utils';
import Link from 'next/link';
import { HTMLAttributes } from 'react';
import { CiSettings } from 'react-icons/ci';
import farmImage from '../../public/images/farm.svg';
import useImage from '../../public/images/user.svg';
import { Portal } from '../control-conditional';
import { OverlayPopup } from '../overlay-popup';
import { useInputs } from './inputs';
import { useOutputs } from './outputs';
import { FlashCardButton, FlashCardCount, FlashCardIcon, HamburgerButton, HamburgerIcon, HeaderActions, HomeLink, ImageLogo, LeftContent, PageTitle, PanelNavbarWrapper, RightContent, SearchButton, SearchIcon, UserButton, UserImage } from './styles';


const headerActionsId = 'headerActions';

export const PanelNavbar = (
  props: HTMLAttributes<HTMLDivElement>
) => {
  const inputs = useInputs();
  const outputs = useOutputs(inputs);
  return (
    <PanelNavbarWrapper
      {...props}
      children={
        <>
          <LeftContent
            children={
              <>
                <HomeLink
                  href='./home'
                  if={!inputs.isMobileWidth}
                  children={
                    <ImageLogo
                      width={44}
                      height={44}
                      src={farmImage}
                      alt='logo'
                      placeholder="blur"
                      blurDataURL={farmImage.src}
                    />
                  }
                />
                <HamburgerButton
                  if={inputs.isMobileWidth}
                  onClick={outputs.onClickHamburger.bind(this)}
                  children={<HamburgerIcon />}
                />
                <PageTitle
                  children={inputs.pageTitle}
                />
              </>
            }
          />
          <RightContent
            if={inputs.isMobileWidth}
            children={
              <HeaderActions
                id={headerActionsId}
              />
            }
          />
          <RightContent
            if={!inputs.isMobileWidth}
            children={
              <>
                <Link
                  href='./test'
                  children={
                    <FlashCardButton
                      $active={inputs.routerPathName.endsWith('/test')}
                      children={
                        <>
                          <FlashCardIcon />
                          <FlashCardCount
                            children={inputs.flashCardCount}
                          />
                        </>
                      }
                    />
                  }
                />
                <Link
                  href='./tags'
                  children={
                    <SearchButton
                      $active={inputs.routerPathName.endsWith('/tags')}
                      aria-label='Tags Config'
                      children={<CiSettings />}
                    />
                  }
                />
                <Link
                  href='./search'
                  children={
                    <SearchButton
                      $active={inputs.routerPathName.endsWith('/search')}
                      aria-label='Search'
                      children={<SearchIcon />}
                    />
                  }
                />
                <OverlayPopup
                  storeKey='userMenu'
                  trigger={props => (
                    <UserButton
                      {...props}
                      children={
                        <UserImage
                          width={44}
                          height={44}
                          src={inputs.session?.user?.image || useImage.src}
                          alt='user image'
                          priority={true}
                        />
                      }
                    />
                  )}
                  overlay={
                    <>
                      <PopupOption
                        children='Sign Out'
                        onClick={outputs.onClickSignOut.bind(this)}
                      />
                      <PopupOption
                        children='Settings'
                      />
                    </>
                  }
                />
              </>
            }
          />
        </>
      }
    />
  );
}

export const HeaderAction = (props: { children: React.ReactNode }) => {
  const component = useComponent();
  return (
    <Portal
      if={component.isMounted}
      children={props.children}
      domId={headerActionsId}
    />
  )
}

