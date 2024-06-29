"use client";
import { FilterIcon } from '@/utils/style-utils';
import { ActiveNote } from '../active-note';
import { ActiveNoteSettings } from '../active-note-settings';
import { ButtonIcon } from '../button-icon';
import { History } from '../history';
import { Popup } from '../popup';
import { Related } from '../related';
import { ActivePanel, FilterPopup, Header, HistoryPanel, HomeWrapper, RelatedPanel } from './styles';



export function HomeDesktop() {
  return (
    <HomeWrapper
      children={
        <>
          <HistoryPanel
            heading={
              <Header
                children="History"
              />
            }
            body={
              <History />
            }
          />
          <ActivePanel
            heading={
              <Header
                children={
                  <>
                    Active Note
                    <ActiveNoteSettings />
                  </>
                }
              />
            }
            body={
              <ActiveNote />
            }
          />
          <RelatedPanel
            heading={
              <Header
                children={
                  <>
                    Related
                    <Popup
                      storeKey='relatedMenu'
                      trigger={props => (
                        <ButtonIcon
                          {...props}
                          aria-label='Filter'
                          children={<FilterIcon />}
                        />
                      )}
                      overlay={
                        <FilterPopup />
                      }
                    />
                  </>
                }
              />
            }
            body={
              <Related />
            }
          />
        </>
      }
    />
  );
}
