"use client";
import { LeftIcon, RightIcon, UpIcon } from '@/utils/style-utils';
import { useInputs } from './inputs';
import { useOutputs } from './outputs';
import { ActivePane, CenterPanel, ExpandHistoryToggleButton, ExpandRelatedToggleButton, ExpandTagsToggleButton, HistoryPanel, HomeWrapper, RelatedPanel, TabsPanel } from './styles';



export default function Page() {
  const inputs = useInputs();
  const outputs = useOutputs(inputs);
  return (
    <HomeWrapper
      children={
        <>
          <HistoryPanel
            $expanded={inputs.historyExpanded}
            onSelectNote={outputs.onClickHistoricalNote}
          />
          <CenterPanel
            children={
              <>
                <ActivePane />
                <TabsPanel
                  $expanded={inputs.tagsExpanded}
                  selection={inputs.selectedTab}
                  onSelectTab={outputs.onSelectTab}
                  options={inputs.tabOptions}
                />
              </>
            }
          />
          <RelatedPanel
            $expanded={inputs.similarExpanded}
            onSelectNote={outputs.onClickRelatedNote}
          />
          <ExpandHistoryToggleButton
            selected={inputs.historyExpanded}
            onClick={outputs.onClickHistoryToggle}
            children={<RightIcon />}
            aria-label='Expand History'
          />
          <ExpandTagsToggleButton
            selected={inputs.tagsExpanded}
            onClick={outputs.onClickTagsToggle}
            children={<UpIcon />}
            aria-label='Expand Tags'
          />
          <ExpandRelatedToggleButton
            selected={inputs.similarExpanded}
            onClick={outputs.onClickSimilarToggle}
            children={<LeftIcon />}
            aria-label='Expand Related'
          />
        </>
      }
    />
  );
}

