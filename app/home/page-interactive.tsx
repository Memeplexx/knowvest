"use client";
import '@/utils/polyfills';
import { ActiveNoteFlashCards } from '@/components/active-note-flash-cards';
import { Navbar } from '@/components/navbar';
import { Tags } from '@/components/tags';
import { DownIcon, LeftIcon, RightIcon, UpIcon } from '@/utils/style-utils';
import { useInputs } from './inputs';
import { useOutputs } from './outputs';
import { BodyWrapper, HistoryPanel, CenterPanel, ActivePane, TabsPanel, RelatedPanel, ExpandHistoryToggleButton, ExpandTagsToggleButton, ExpandHeaderToggleButton, ExpandRelatedToggleButton } from './styles';


export default function HomeInteractive() {
  const inputs = useInputs();
  const outputs = useOutputs(inputs);
  return (
    <>
      <Navbar
        showIf={inputs.headerExpanded}
      />
      <BodyWrapper
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
    </>
  );
}

