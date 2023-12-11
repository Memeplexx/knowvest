import { PopupOption } from '@/utils/styles';
import Farm from '../../public/images/farm.svg';
import { Modal } from '../modal';
import { Popup } from '../popup';
import { SearchDialog } from '../search';
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
        showIf={inputs.showDialog}
        onClose={outputs.onHideDialog}
        children={
          <SearchDialog
            onHide={outputs.onHideDialog}
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
                    children={<SearchIcon />}
                    onClick={outputs.onClickSearchButton}
                    aria-label='Search'
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

