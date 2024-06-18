"use client";
import { ActiveNoteFlashCards } from '@/components/active-note-flash-cards';
import { Tags } from '@/components/tags';
import { DownIcon, LeftIcon, RightIcon, UpIcon } from '@/utils/style-utils';
import { useInputs } from './inputs';
import { useOutputs } from './outputs';
import { ActivePane, CenterPanel, ExpandHeaderToggleButton, ExpandHistoryToggleButton, ExpandRelatedToggleButton, ExpandTagsToggleButton, HistoryPanel, HomeWrapper, RelatedPanel, TabsPanel } from './styles';



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
                  options={[
                    { label: 'Tags', panel: Tags },
                    { label: 'Flashcards', panel: ActiveNoteFlashCards },
                  ]}
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
          <ExpandHeaderToggleButton
            selected={inputs.headerExpanded}
            onClick={outputs.onClickHeaderToggle}
            children={<DownIcon />}
            aria-label='Expand Header'
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

