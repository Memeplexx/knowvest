"use client";
import { PopupOption } from '@/utils/style-utils';
import Link from 'next/link';
import farmImage from '../../public/images/farm.svg';
import useImage from '../../public/images/user.svg';
import { FlashCardTester } from '../flash-card-tester';
import { Modal } from '../modal';
import { Popup } from '../popup';
import { Props } from './constants';
import { useInputs } from './inputs';
import { useOutputs } from './outputs';
import { FlashCardButton, FlashCardCount, FlashCardIcon, ImageLogo, RightContent, SearchButton, SearchIcon, UserButton, UserImage, Wrapper } from './styles';


export const Navbar = (props: Props) => {
  const inputs = useInputs();
  const outputs = useOutputs(inputs);
  return (
    <>
      <Modal
        if={inputs.showFlashCardsDialog}
        onClose={outputs.onHideFlashCardsDialog}
        children={
          <FlashCardTester
            onHide={outputs.onHideFlashCardsDialog}
          />
        }
      />
      <Wrapper
        $show={!!props.if}
        children={
          <>
            <ImageLogo
              width={44}
              height={44}
              src={farmImage}
              alt='logo'
              placeholder="blur"
              blurDataURL={farmImage.src}
            />
            <RightContent
              children={
                <>
                  <FlashCardButton
                    aria-label='Flash Card'
                    onClick={outputs.onClickFlashCardsButton}
                    title={`Flash Cards (${inputs.flashCardCount})`}
                    children={
                      <>
                        <FlashCardIcon />
                        <FlashCardCount
                          children={inputs.flashCardCount}
                        />
                      </>
                    }
                  />
                  <Link
                    href='/search'
                    children={
                      <SearchButton
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
    </>
  );
}

