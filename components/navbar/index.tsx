"use client";
import { PopupOption } from '@/utils/style-utils';
import { Modal } from '../modal';
import { Popup } from '../popup';
import { SearchDialog } from '../search';
import { Props } from './constants';
import { useInputs } from './inputs';
import { useOutputs } from './outputs';
import { FlashCardButton, FlashCardCount, FlashCardIcon, ImageLogo, LoaderPlaceholder, RightContent, SearchButton, SearchIcon, UserButton, UserImage, Wrapper } from './styles';
import { FlashCardTester } from '../flash-card-tester';
import farmImage from '../../public/images/farm.svg';
import useImage from '../../public/images/user.svg';


export const Navbar = (props: Props) => {
  const inputs = useInputs();
  const outputs = useOutputs(inputs);
  return (
    <>
      <Modal
        if={inputs.showSearchDialog}
        children={
          <SearchDialog
            onHide={outputs.onHideSearchDialog}
          />
        }
      />
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
                  <SearchButton
                    aria-label='Search'
                    onClick={outputs.onClickSearchButton}
                    children={<SearchIcon />}
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
            <LoaderPlaceholder
              if={!inputs.stateInitialized}
            />
          </>
        }
      />
    </>
  );
}

