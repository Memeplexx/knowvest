import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]";
import { getProviders, signIn } from "next-auth/react";
import { CenterContent, Divider, ProviderButton, SubTitle, Title, Wrapper } from "@/utils/pages/landing/styles";

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions);

  // If the user is already logged in, redirect.
  // Note: Make sure not to redirect to the same page
  // To avoid an infinite loop!
  if (session) {
    return { redirect: { destination: "/home" } };
  }

  const providers = await getProviders();

  return {
    props: { providers: providers ?? [] },
  }
}

export default function Login({ providers }: InferGetServerSidePropsType<typeof getServerSideProps>) {
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
              {Object.values(providers).map(provider => (
                <ProviderButton
                  key={provider.name}
                  onClick={() => signIn(provider.id)}
                  children={provider.name}
                  aria-label={`Sign in with ${provider.name}`}
                />
              ))}
            </>
          }
        />
      }
    />
  )
}