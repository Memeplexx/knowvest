import { Navbar } from '@/components/navbar';
import { Snackbar } from '@/components/snackbar';
import { UserId } from '@/server/dtos';
import { prisma } from '@/server/routers/_app';
import { HomeContext, OlikContext, ServerSideProps } from '@/utils/pages/home/constants';
import { useEvents } from '@/utils/pages/home/events';
import { useHooks } from '@/utils/pages/home/hooks';
import { DownIcon, LeftIcon, RightIcon, UpIcon } from '@/utils/styles';
import { GetServerSidePropsContext } from 'next';
import { getSession } from 'next-auth/react';
import Head from 'next/head';
import superjson from 'superjson';
import { ActivePanel, BodyWrapper, CenterPanel, ExpandHeaderToggleButton, ExpandHistoryToggleButton, ExpandRelatedToggleButton, ExpandTagsToggleButton, HistoryPanel, RelatedPanel, TagsPanel, Wrapper } from '@/utils/pages/home/styles';


export async function getServerSideProps(context: GetServerSidePropsContext) {

  // If there is no session, redirect to logic page
  const session = await getSession(context);
  if (!session || new Date(session.expires).getTime() < Date.now()) {
    return { redirect: { destination: '/', permanent: false } }
  }

  // Find else create user by looking them up via the email in their session
  const user = session.user!;
  const userByEmail
    = await prisma.user.findFirst({ where: { email: user.email! } })
    || await prisma.user.create({ data: { email: user.email!, name: user.name!, image: user.image! } });

  // Return props using the user id to select the correct data
  const userId = userByEmail.id as UserId;
  return {
    props: superjson.serialize({
      tags: await prisma.tag.findMany({ where: { userId } }),
      notes: await prisma.note.findMany({ where: { userId }, orderBy: { dateViewed: 'desc' } }),
      noteTags: await prisma.noteTag.findMany({ where: { tag: { userId } } }),
      groups: await prisma.group.findMany({ where: { userId } }),
      synonymGroups: await prisma.synonymGroup.findMany({ where: { group: { userId } } }),
    })
  };
}

export default function Home(
  propsSerialized: Parameters<typeof superjson.deserialize>[0],
) {
  const state = useHooks(superjson.deserialize<ServerSideProps>(propsSerialized));
  const events = useEvents(state);
  return (
    <OlikContext.Provider
      value={state.appStore}
      children={
        <HomeContext.Provider
          value={{
            notifyError: events.onNotifyError,
            notifySuccess: events.onNotifySuccess,
            notifyInfo: events.onNotifyInfo,
          }}
          children={
            <>
              <Wrapper
                children={
                  <>
                    <Head>
                      <title
                        children='Knowledge Harvest'
                      />
                      <meta
                        name="viewport"
                        content="user-scalable=no, width=device-width, initial-scale=1.0"
                      />
                      <meta
                        name="apple-mobile-web-app-capable"
                        content="yes"
                      />
                    </Head>
                    <Navbar
                      $show={state.headerExpanded}
                    />
                    <BodyWrapper
                      children={
                        <>
                          <HistoryPanel
                            $expanded={state.historyExpanded}
                            onSelectNote={events.onClickHistoricalNote}
                          />
                          <CenterPanel
                            children={
                              <>
                                <ActivePanel />
                                <TagsPanel
                                  $expanded={state.tagsExpanded}
                                />
                              </>
                            }
                          />
                          <RelatedPanel
                            $expanded={state.similarExpanded}
                            onSelectNote={events.onClickRelatedNote}
                          />
                          <ExpandHistoryToggleButton
                            selected={state.historyExpanded}
                            onClick={events.onClickHistoryToggle}
                            children={<RightIcon />}
                          />
                          <ExpandTagsToggleButton
                            selected={state.tagsExpanded}
                            onClick={events.onClickTagsToggle}
                            children={<UpIcon />}
                          />
                          <ExpandHeaderToggleButton
                            selected={!state.headerExpanded}
                            onClick={events.onClickHeaderToggle}
                            children={<DownIcon />}
                          />
                          <ExpandRelatedToggleButton
                            selected={state.similarExpanded}
                            onClick={events.onClickSimilarToggle}
                            children={<LeftIcon />}
                          />
                        </>
                      }
                    />
                  </>
                }
              />
              <Snackbar
                message={state.message}
                status={state.status}
                onMessageClear={events.onMessageClear}
              />
            </>
          }
        />
      }
    />
  );
}

