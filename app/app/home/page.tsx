"use client";
import { useInputs } from './inputs';
import { ActivePane, HistoryPanel, HomeWrapper, RelatedPanel } from './styles';



export default function Page() {
  const inputs = useInputs();
  return (
    <HomeWrapper
      children={
        <>
          <HistoryPanel
            if={!inputs.isMobileWidth}
          />
          <ActivePane />
          <RelatedPanel
            if={!inputs.isMobileWidth}
          />
        </>
      }
    />
  );
}

