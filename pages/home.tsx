import { Navbar } from '@/components/navbar';
import { Snackbar } from '@/components/snackbar';
import { UserId } from '@/server/dtos';
import { prisma } from '@/server/routers/_app';
import { NotificationContext, ServerSideProps } from '@/utils/pages/home/constants';
import { useOutputs } from '@/utils/pages/home/outputs';
import { useInputs } from '@/utils/pages/home/inputs';
import { ActivePanel, BodyWrapper, CenterPanel, ExpandHeaderToggleButton, ExpandHistoryToggleButton, ExpandRelatedToggleButton, ExpandTagsToggleButton, HistoryPanel, RelatedPanel, TagsPanel, Wrapper } from '@/utils/pages/home/styles';
import { DownIcon, LeftIcon, RightIcon, UpIcon } from '@/utils/styles';
import { GetServerSidePropsContext } from 'next';
import { getSession } from 'next-auth/react';
import superjson from 'superjson';


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
                  showIf={!inputs.headerContracted}
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
                        selected={inputs.headerContracted}
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

