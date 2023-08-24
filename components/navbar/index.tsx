import { ImageLogo, RightContent, SearchButton, SearchIcon, UserButton, Wrapper } from './styles';
import { useHooks } from './hooks';
import { useEvents } from './events';
import { PopupOption, PopupOptions } from '@/utils/styles';
import { SearchDialog } from '../search';
import { Props } from './constants';

export const Navbar = (props: Props) => {
  const hooks = useHooks();
  const events = useEvents();
  const { state, refs } = hooks;
  return (
    <>
      <SearchDialog
        show={state.showDialog}
        onHide={events.onHideDialog}
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
                    onClick={events.onClickSearchButton}
                  />
                  <UserButton
                    src={state.session?.user?.image ?? ''}
                    alt='user image'
                    ref={refs.floating.refs.setReference}
                    onClick={events.onClickUserButton}
                  />
                  <PopupOptions
                    showIf={state.showOptions}
                    ref={state.showOptions ? refs.floating.refs.setFloating : null}
                    style={refs.floating.floatingStyles}
                    children={
                      <>
                        <PopupOption
                          children='Sign Out'
                          onClick={events.onClickSignOut}
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

