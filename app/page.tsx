"use server";
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import LoginButton from './page/page-interactive';
import { CenterContent, Divider, Title, Wrapper } from './page/styles';

export default async function Index() {
  const session = await getServerSession(authOptions);
  if (session) {
    redirect('/home');
  }
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
              <LoginButton
                aria-label='Sign in'
              />
            </>
          }
        />
      }
    />
  )
}
