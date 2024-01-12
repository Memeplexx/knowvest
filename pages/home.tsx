import { ActiveNoteFlashCards } from '@/components/active-note-flash-cards';
import { Navbar } from '@/components/navbar';
import { Tags } from '@/components/tags';
import { useInputs } from '@/utils/pages/home/inputs';
import { useOutputs } from '@/utils/pages/home/outputs';
import { ActivePane, BodyWrapper, CenterPanel, ExpandHeaderToggleButton, ExpandHistoryToggleButton, ExpandRelatedToggleButton, ExpandTagsToggleButton, HistoryPanel, RelatedPanel, TabsPanel, Wrapper } from '@/utils/pages/home/styles';
import { DownIcon, LeftIcon, RightIcon, UpIcon } from '@/utils/styles';
import { getSession } from 'next-auth/react';
import { GetServerSidePropsContext } from 'next/types';


export async function getServerSideProps(context: GetServerSidePropsContext) {
  // If there is no session, or if it has expired, redirect to logic page
  const session = await getSession(context);
  if (!session || new Date(session.expires).getTime() < Date.now()) {
    return { redirect: { destination: '/', permanent: false } }
  }
  return { props: {} };
}

export default function Home() {
  const inputs = useInputs();
  const outputs = useOutputs(inputs);
  return (
    <Wrapper
      children={
        <>
          <Navbar
            // showIf={inputs.headerExpanded}
            showIf={true}
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
      }
    />
  );
}

