import { PopupOption } from '@/utils/styles';
import Farm from '../../public/images/farm.svg';
import { Modal } from '../modal';
import { Popup } from '../popup';
import { SearchDialog } from '../search';
import { Props } from './constants';
import { useInputs } from './inputs';
import { useOutputs } from './outputs';
import { ImageLogo, RightContent, SearchButton, SearchIcon, UserButton, UserImage, Wrapper } from './styles';

export const Navbar = (props: Props) => {
  const inputs = useInputs();
  const outputs = useOutputs();
  const { state } = inputs;
  return (
    <>
      <Modal
        showIf={state.showDialog}
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
                            src={state.session?.user?.image || '/images/user.svg'}
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
      {/* <PopupOptions
        showIf={state.showOptions}
        ref={state.showOptions ? refs.floating.refs.setFloating : null}
        style={refs.floating.floatingStyles}
        children={
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
      /> */}
    </>
  );
}

