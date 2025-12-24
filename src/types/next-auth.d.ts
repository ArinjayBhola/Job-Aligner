import NextAuth, { DefaultSession } from "next-auth"

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      id: string
      credits: number
      isPro: boolean
    } & DefaultSession["user"]
  }

  interface User {
    credits: number
    isPro: boolean
    stripeCustomerId?: string | null
  }
}
