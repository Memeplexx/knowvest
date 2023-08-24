import { ImageLogo, RightContent, SearchButton, SearchIcon, UserButton, Wrapper } from './styles';
import { useInputs } from './inputs';
import { useOutputs } from './outputs';
import { PopupOption, PopupOptions } from '@/utils/styles';
import { SearchDialog } from '../search';
import { Props } from './constants';

export const Navbar = (props: Props) => {
  const inputs = useInputs();
  const outputs = useOutputs();
  const { state, refs } = inputs;
  return (
    <>
      <SearchDialog
        show={state.showDialog}
        onHide={outputs.onHideDialog}
      />
      <Wrapper
        $show={props.$show}
        children={
          <>
            <ImageLogo
              width={44}
              height={44}
              src="/images/farm.png"
              alt='logo'
              priority={true}
            />
            <RightContent
              children={
                <>
                  <SearchButton
                    children={<SearchIcon />}
                    onClick={outputs.onClickSearchButton}
                  />
                  <UserButton
                    src={state.session?.user?.image ?? ''}
                    alt='user image'
                    ref={refs.floating.refs.setReference}
                    onClick={outputs.onClickUserButton}
                  />
                  <PopupOptions
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

