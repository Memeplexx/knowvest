"use server";
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { routes } from '@/utils/app-utils';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import PageInteractive from './page/page-interactive';
import { CenterContent, Divider, SubTitle, Title, Wrapper } from './page/styles';

export default async function Index() {
  const session = await getServerSession(authOptions);
  if (session)
    redirect(routes.home);
  return (
    <Wrapper
      children={
        <CenterContent
          children={
            <>
              <Title
                children="know-vest"
              />
              <Divider />
              <SubTitle
                children="Read with Purpose"
              />
              <PageInteractive
                aria-label='Sign in'
              />
            </>
          }
        />
      }
    />
  )
}
