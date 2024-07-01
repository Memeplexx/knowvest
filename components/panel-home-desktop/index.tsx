"use client";
import { useRef } from 'react';
import { ContainerWithStickyHeaderHandle } from '../container-with-sticky-header/constants';
import { OverlayNoteActive } from '../overlay-note-active';
import { OverlayNotesRelated } from '../overlay-notes-related';
import { PanelNoteActive } from '../panel-note-active';
import { PanelNotesPrevious } from '../panel-notes-previous';
import { PanelNotesRelated } from '../panel-notes-related';
import { ActiveHeader, ActivePanel, HistoryHeader, HistoryPanel, PanelHomeDesktopWrapper, RelatedHeader, RelatedPanel } from './styles';



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
                    {/* <OverlayPopup
                      storeKey='relatedMenu'
                      trigger={props => (
                        <ControlButtonIcon
                          {...props}
                          aria-label='Filter'
                          children={<CiFilter />}
                        />
                      )}
                      overlay={
                        <FilterPopup />
                      }
                    /> */}
                    <OverlayNotesRelated />
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
