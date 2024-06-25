"use client";
import { useInputs } from './inputs';
import { useOutputs } from './outputs';
import { ActivePane, CenterPanel, FlashCardPane, HistoryPanel, HomeWrapper, RelatedPanel } from './styles';



export default function Page() {
  const inputs = useInputs();
  const outputs = useOutputs(inputs);
  return (
    <HomeWrapper
      children={
        <>
          <HistoryPanel
            if={!inputs.isMobileWidth}
            onSelectNote={outputs.onClickHistoricalNote}
          />
          <CenterPanel
            children={
              <>
                <ActivePane />
                <FlashCardPane
                  if={!inputs.isMobileWidth}
                />
              </>
            }
          />
          <RelatedPanel
            if={!inputs.isMobileWidth}
            onSelectNote={outputs.onClickRelatedNote}
          />
        </>
      }
    />
  );
}

