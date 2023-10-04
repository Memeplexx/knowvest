import { GetServerSidePropsContext } from "next";
import { getSession } from "next-auth/react";
import { prisma } from "@/server/routers/_app";
import superjson from 'superjson';
import { UserId } from "@/server/dtos";

export async function getCommonServerSideProps(context: GetServerSidePropsContext) {

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
