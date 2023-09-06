import { ImageLogo, RightContent, SearchButton, SearchIcon, UserButton, Wrapper } from './styles';
import { useInputs } from './inputs';
import { useOutputs } from './outputs';
import { PopupOption, PopupOptions } from '@/utils/styles';
import { SearchDialog } from '../search';
import { Props } from './constants';
import Farm from '../../public/images/farm.svg';

export const Navbar = (props: Props) => {
  const inputs = useInputs();
  const outputs = useOutputs(inputs);
  const { state, refs } = inputs;
  return (
    <>
      <SearchDialog
        show={state.showDialog}
        onHide={outputs.onHideDialog}
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
                  <UserButton
                    width={44}
                    height={44}
                    src={state.session?.user?.image || '/images/user.svg'}
                    alt='user image'
                    ref={refs.floating.refs.setReference}
                    onClick={outputs.onClickUserButton}
                    priority={true}
                  />
                </>
              }
            />
          </>
        }
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
  );
}

