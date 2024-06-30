"use client";
import { FilterIcon } from '@/utils/style-utils';
import { useRef } from 'react';
import { ContainerWithStickyHeaderHandle } from '../container-with-sticky-header/constants';
import { ControlButtonIcon } from '../control-button-icon';
import { OverlayNoteActive } from '../overlay-note-active';
import { OverlayPopup } from '../overlay-popup';
import { PanelNoteActive } from '../panel-note-active';
import { PanelNotesPrevious } from '../panel-notes-previous';
import { PanelNotesRelated } from '../panel-notes-related';
import { ActiveHeader, ActivePanel, FilterPopup, HistoryHeader, HistoryPanel, PanelHomeDesktopWrapper, RelatedHeader, RelatedPanel } from './styles';



export function PanelHomeDesktop() {
  const historyPanelRef = useRef<ContainerWithStickyHeaderHandle>(null);
  const relatedPanelRef = useRef<ContainerWithStickyHeaderHandle>(null);
  return (
    <PanelHomeDesktopWrapper
      children={
        <>
          <HistoryPanel
            ref={historyPanelRef}
            heading={
              <HistoryHeader
                children="History"
              />
            }
            body={
              <PanelNotesPrevious
                onSelectNote={() => historyPanelRef.current?.scrollToTop()}
              />
            }
          />
          <ActivePanel
            heading={
              <ActiveHeader
                children={
                  <>
                    Active Note
                    <OverlayNoteActive />
                  </>
                }
              />
            }
            body={
              <PanelNoteActive />
            }
          />
          <RelatedPanel
            ref={relatedPanelRef}
            heading={
              <RelatedHeader
                children={
                  <>
                    Related
                    <OverlayPopup
                      storeKey='relatedMenu'
                      trigger={props => (
                        <ControlButtonIcon
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
              <PanelNotesRelated
                onSelectNote={() => relatedPanelRef.current?.scrollToTop()}
              />
            }
          />
        </>
      }
    />
  );
}
