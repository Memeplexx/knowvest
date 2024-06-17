"use server"
import { AppWrapper } from "@/components/app-wrapper";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { Wrapper } from "./styles";

export default async function Layout({ children }: { children: React.ReactNode }) {

  // Log user out if session expired
  const session = await getServerSession(authOptions);
  if (!session || new Date(session.expires).getTime() < Date.now())
    redirect('/?session-expired=true');

  return (
    <Wrapper
      children={
        <AppWrapper
          children={children}
        />
      }
    />
  )
}

