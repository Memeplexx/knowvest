"use client";
import { ControlButtonIcon } from "@/components/control-button-icon";
import { OverlayPopup } from "@/components/overlay-popup";
import { FilterPopup } from "@/components/panel-home-desktop/styles";
import { HeaderAction } from "@/components/panel-navbar";
import { PanelNotesRelated } from "@/components/panel-notes-related";
import { CiFilter } from "react-icons/ci";
import styled from "styled-components";

export default function Page() {
  return (
    <>
      <PanelNotesRelatedWrapper />
      <HeaderAction
        children={
          <OverlayPopup
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
          />
        }
      />
    </>
  );
}

const PanelNotesRelatedWrapper = styled(PanelNotesRelated)`
  background-image: linear-gradient(to right, #131313, #212121);
`;
