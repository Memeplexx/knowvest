"use server";
import { getServerSession } from 'next-auth';
import LoginButton from './page/page-interactive';
import { CenterContent, Title, Divider, Wrapper } from './page/styles';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { redirect } from 'next/navigation';

export default async function Index() {
  const session = await getServerSession(authOptions);
  if (session) {
    redirect('/home');
  }
  return (
    <>
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
    </>
  )
}
