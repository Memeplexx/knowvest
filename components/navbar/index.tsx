"use client";
import { PopupOption } from '@/utils/style-utils';
import Farm from '../../public/images/farm.svg';
import { Modal } from '../modal';
import { Popup } from '../popup';
import { SearchDialog } from '../search';
import { Props } from './constants';
import { useInputs } from './inputs';
import { useOutputs } from './outputs';
import { FlashCardButton, FlashCardCount, FlashCardIcon, ImageLogo, RightContent, SearchButton, SearchIcon, UserButton, UserImage, Wrapper } from './styles';
import { FlashCardTester } from '../flash-card-tester';

export const Navbar = (props: Props) => {
  const inputs = useInputs();
  const outputs = useOutputs(inputs);
  return (
    <>
      <Modal
        showIf={inputs.showSearchDialog}
        onClose={outputs.onHideSearchDialog}
        children={
          <SearchDialog
            onHide={outputs.onHideSearchDialog}
          />
        }
      />
      <Modal
        showIf={inputs.showFlashCardsDialog}
        onClose={outputs.onHideFlashCardsDialog}
        children={
          <FlashCardTester
            onHide={outputs.onHideFlashCardsDialog}
          />
        }
      />
      <Wrapper
        $show={props.showIf}
        children={
          <>
            <ImageLogo
              width={44}
              height={44}
              src={Farm}
              alt='logo'
              placeholder="blur"
              blurDataURL={'/images/farm.svg'}
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
                    trigger={props => (
                      <UserButton
                        {...props}
                        children={
                          <UserImage
                            width={44}
                            height={44}
                            src={inputs.session?.user?.image || '/images/user.svg'}
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

