"use client";
import '@/utils/polyfills';
import { PopupOption, SettingsIcon } from '@/utils/style-utils';
import Link from 'next/link';
import farmImage from '../../public/images/farm.svg';
import useImage from '../../public/images/user.svg';
import { Popup } from '../popup';
import { Props } from './constants';
import { useInputs } from './inputs';
import { useOutputs } from './outputs';
import { FlashCardButton, FlashCardCount, FlashCardIcon, ImageLogo, NavBarWrapper, RightContent, SearchButton, SearchIcon, UserButton, UserImage } from './styles';


export const Navbar = (props: Props) => {
  const inputs = useInputs();
  const outputs = useOutputs(inputs);
  return (
    <NavBarWrapper
      $show={!!props.if}
      children={
        <>
          <Link
            href='./home'
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
          <RightContent
            children={
              <>
                <Link
                  href='./test'
                  onClick={outputs.onClickNavigate}
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
                  onClick={outputs.onClickNavigate}
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
                  onClick={outputs.onClickNavigate}
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

