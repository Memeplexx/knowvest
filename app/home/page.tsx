"use server";

import '@/utils/array';
import { redirect } from 'next/navigation';
import HomeInteractive from './page-interactive';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { Wrapper } from '@/utils/pages/home/styles';


export default async function Home() {
  
  const session = await getServerSession(authOptions);
  if (!session || new Date(session.expires).getTime() < Date.now()) {
    redirect('/');
  }

  return (
    <Wrapper
      children={
        <HomeInteractive />
      }
    />
  );
}

