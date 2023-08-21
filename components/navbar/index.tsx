import { ImageLogo, RightContent, SearchButton, SearchIcon, UserButton, Wrapper } from './styles';
import { useHooks } from './hooks';
import { useEvents } from './events';
import { PopupOption, PopupOptions } from '@/utils/styles';
import { SearchDialog } from '../search';
import { Props } from './constants';

export const Navbar = (props: Props) => {
  const hooks = useHooks();
  const events = useEvents(hooks);
  return (
    <>
      <SearchDialog
        show={hooks.showDialog}
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
                    src={hooks.session?.user?.image ?? ''}
                    alt='user image'
                    ref={hooks.floating.refs.setReference}
                    onClick={events.onClickUserButton}
                  />
                  <PopupOptions
                    showIf={hooks.showOptions}
                    ref={hooks.showOptions ? hooks.floating.refs.setFloating : null}
                    style={hooks.floating.floatingStyles}
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

