"use server";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import ProviderButtons from "./provider-buttons";
import { CenterContent, Divider, SubTitle, Title, Wrapper } from "./styles";


export default async function Login() {

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
              <SubTitle
                children="sign in options"
              />
              <Divider />
              <ProviderButtons />
            </>
          }
        />
      }
    />
  )
}