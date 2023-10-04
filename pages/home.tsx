import { Navbar } from '@/components/navbar';
import { Snackbar } from '@/components/snackbar';
import { NotificationContext, ServerSideProps } from '@/utils/pages/home/constants';
import { useInputs } from '@/utils/pages/home/inputs';
import { useOutputs } from '@/utils/pages/home/outputs';
import { ActivePanel, BodyWrapper, CenterPanel, ExpandHeaderToggleButton, ExpandHistoryToggleButton, ExpandRelatedToggleButton, ExpandTagsToggleButton, HistoryPanel, RelatedPanel, TagsPanel, Wrapper } from '@/utils/pages/home/styles';
import { getCommonServerSideProps } from '@/utils/server-side-props';
import { DownIcon, LeftIcon, RightIcon, UpIcon } from '@/utils/styles';
import superjson from 'superjson';


export const getServerSideProps = getCommonServerSideProps;

export default function Home(
  propsSerialized: Parameters<typeof superjson.deserialize>[0],
) {
  const inputs = useInputs(superjson.deserialize<ServerSideProps>(propsSerialized));
  const outputs = useOutputs(inputs);
  return (
    <NotificationContext.Provider
      value={{
        error: outputs.onNotifyError,
        success: outputs.onNotifySuccess,
        info: outputs.onNotifyInfo,
      }}
      children={
        <>
          <Wrapper
            children={
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
                            <ActivePanel />
                            <TagsPanel
                              $expanded={inputs.tagsExpanded}
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
          <Snackbar
            message={inputs.message}
            status={inputs.status}
            onMessageClear={outputs.onMessageClear}
          />
        </>
      }
    />
  );
}

