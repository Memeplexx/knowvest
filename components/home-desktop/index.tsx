"use client";
import { FilterIcon } from '@/utils/style-utils';
import { useRef } from 'react';
import { ActiveNote } from '../active-note';
import { ActiveNoteSettings } from '../active-note-settings';
import { ButtonIcon } from '../button-icon';
import { ContainerWithStickyHeaderHandle } from '../container-with-sticky-header/constants';
import { History } from '../history';
import { Popup } from '../popup';
import { Related } from '../related';
import { ActivePanel, FilterPopup, Header, HistoryPanel, HomeWrapper, RelatedPanel } from './styles';



export function HomeDesktop() {
  const historyPanelRef = useRef<ContainerWithStickyHeaderHandle>(null);
  const relatedPanelRef = useRef<ContainerWithStickyHeaderHandle>(null);
  return (
    <HomeWrapper
      children={
        <>
          <HistoryPanel
            ref={historyPanelRef}
            heading={
              <Header
                children="History"
              />
            }
            body={
              <History
                onSelectNote={() => historyPanelRef.current?.scrollToTop()}
              />
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
            ref={relatedPanelRef}
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
              <Related
                onSelectNote={() => relatedPanelRef.current?.scrollToTop()}
              />
            }
          />
        </>
      }
    />
  );
}
