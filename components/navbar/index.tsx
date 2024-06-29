"use client";
import '@/utils/polyfills';
import { PopupOption, SettingsIcon } from '@/utils/style-utils';
import Link from 'next/link';
import { HTMLAttributes } from 'react';
import farmImage from '../../public/images/farm.svg';
import useImage from '../../public/images/user.svg';
import { Popup } from '../popup';
import { useInputs } from './inputs';
import { useOutputs } from './outputs';
import { FlashCardButton, FlashCardCount, FlashCardIcon, HamburgerButton, HamburgerIcon, HomeLink, ImageLogo, LeftContent, NavBarWrapper, PageTitle, RightContent, SearchButton, SearchIcon, UserButton, UserImage } from './styles';


export const Navbar = (
  props: HTMLAttributes<HTMLDivElement>
) => {
  const inputs = useInputs();
  const outputs = useOutputs(inputs);
  return (
    <NavBarWrapper
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
                  onClick={outputs.onClickHamburger}
                  children={<HamburgerIcon />}
                />
                <PageTitle
                  children={inputs.pageTitle}
                />
              </>
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
                      $active={inputs.routerPatchName.endsWith('/test')}
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
                      $active={inputs.routerPatchName.endsWith('/tags')}
                      aria-label='Tags Config'
                      children={<SettingsIcon />}
                    />
                  }
                />
                <Link
                  href='./search'
                  children={
                    <SearchButton
                      $active={inputs.routerPatchName.endsWith('/search')}
                      aria-label='Search'
                      children={<SearchIcon />}
                    />
                  }
                />
                <Popup
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
                        onClick={outputs.onClickSignOut}
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

