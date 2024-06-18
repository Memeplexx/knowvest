"use server";
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import PageInteractive from './page/page-interactive';
import { CenterContent, Divider, Title, Wrapper } from './page/styles';

export default async function Index() {
  const session = await getServerSession(authOptions);
  if (session)
    redirect('/app/home');
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
