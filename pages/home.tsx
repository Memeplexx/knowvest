import { Navbar } from '@/components/navbar';
import { Snackbar } from '@/components/snackbar';
import { UserId } from '@/server/dtos';
import { prisma } from '@/server/routers/_app';
import { NotificationContext, ServerSideProps } from '@/utils/pages/home/constants';
import { useEvents } from '@/utils/pages/home/events';
import { useHooks } from '@/utils/pages/home/hooks';
import { DownIcon, LeftIcon, RightIcon, UpIcon } from '@/utils/styles';
import { GetServerSidePropsContext } from 'next';
import { getSession } from 'next-auth/react';
import Head from 'next/head';
import superjson from 'superjson';
import { ActivePanel, BodyWrapper, CenterPanel, ExpandHeaderToggleButton, ExpandHistoryToggleButton, ExpandRelatedToggleButton, ExpandTagsToggleButton, HistoryPanel, RelatedPanel, TagsPanel, Wrapper } from '@/utils/pages/home/styles';
import StyledComponentsRegistry from '@/utils/registry';


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

  // Create users first note if it doesn't exist yet
  if (!await prisma.note.findFirst({ where: { userId: userByEmail.id } })) {
    await prisma.note.create({
      data: {
        userId: userByEmail.id,
        text: '# Welcome to Knowledge Harvest! ## This is your first note. Remove this text to get started ❤️',
        dateViewed: new Date(),
      }
    });
  }

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
    <NotificationContext.Provider
      value={{
        error: events.onNotifyError,
        success: events.onNotifySuccess,
        info: events.onNotifyInfo,
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
                </Head>
                <StyledComponentsRegistry
                  children={
                    <Navbar
                      showIf={state.headerExpanded}
                    />
                  }
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
                        aria-label='Expand History'
                      />
                      <ExpandTagsToggleButton
                        selected={state.tagsExpanded}
                        onClick={events.onClickTagsToggle}
                        children={<UpIcon />}
                        aria-label='Expand Tags'
                      />
                      <ExpandHeaderToggleButton
                        selected={!state.headerExpanded}
                        onClick={events.onClickHeaderToggle}
                        children={<DownIcon />}
                        aria-label='Expand Header'
                      />
                      <ExpandRelatedToggleButton
                        selected={state.similarExpanded}
                        onClick={events.onClickSimilarToggle}
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
            message={state.message}
            status={state.status}
            onMessageClear={events.onMessageClear}
          />
        </>
      }
    />
  );
}

