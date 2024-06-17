"use server";
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import '@/utils/polyfills';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import SearchInteractive from './page-interactive';
import { Wrapper } from './styles';


export default async function Search() {

  const session = await getServerSession(authOptions);
  if (!session || new Date(session.expires).getTime() < Date.now())
    redirect('/');

  return (
    <Wrapper
      children={
        <SearchInteractive />
      }
    />
  );
}

