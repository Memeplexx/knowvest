import NextAuth, { NextAuthOptions } from "next-auth"
import GithubProvider from "next-auth/providers/github"
import GoogleProvider from "next-auth/providers/google"

export const authOptions: NextAuthOptions = {
  secret: process.env['NEXTAUTH_SECRET']!,
  providers: [
    GithubProvider({
      clientId: process.env['GITHUB_ID']!,
      clientSecret: process.env['GITHUB_SECRET']!,
    }),
    GoogleProvider({
      clientId: process.env['GOOGLE_ID']!,
      clientSecret: process.env['GOOGLE_SECRET']!,
    })
  ],
  session: {
    maxAge: 60 * 60 * 8 * 4
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    redirect: () => '/app/home',
  }
}
export default NextAuth(authOptions)