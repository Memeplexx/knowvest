"use server"
import { ContainerOnceLoggedIn } from "@/components/container-once-logged-in";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { TextSearchProvider } from "@/utils/text-search-context";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { Wrapper } from "./styles";

export default async function Layout({ children }: { children: React.ReactNode }) {

  // Log user out if session expired
  const session = await getServerSession(authOptions);
  if (!session)
    redirect('/?session-expired=true');

  return (
    <Wrapper
      children={
        <TextSearchProvider
          children={
            <ContainerOnceLoggedIn
              children={children}
            />
          }
        />
      }
    />
  )
}

