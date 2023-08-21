import GithubProvider from "next-auth/providers/github"
import GoogleProvider from "next-auth/providers/google"
import NextAuth, { NextAuthOptions } from "next-auth"

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET as string,
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_SECRET!,
    })
  ],
  session: {
    maxAge: 60 * 60 * 8
  },
  pages: {
    signIn: "/login",
  }
}
export default NextAuth(authOptions)