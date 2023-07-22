import NextAuth, { AuthOptions } from "next-auth"
import GithubProvider from "next-auth/providers/github"
export const authOptions: AuthOptions = {
  // Configure one or more authentication providers
  providers: [
    GithubProvider({
      clientId: process.env.AUTH_GH_CLIENT_ID ?? "",
      clientSecret: process.env.AUTH_GH_CLIENT_SECRET ?? ""
    }),
    // ...add more providers here
  ], callbacks: {
    async signIn({ user, account, profile, email, credentials }) {

      if (user.id.toString() == process.env.AUTH_DEBUG_GH_ADMIN_ID) { //! env vars
        return true
      } else {
        // Return false to display a default error message
        return false
        // Or you can return a URL to redirect to:
        // return '/unauthorized'
      }
    }
  },
  secret: "@AWeFkHpv!jzVr^a9nRXS8^PcRFnDaLvt65mJb&*C^pcCgpbHFzzKN",



}
export default NextAuth(authOptions)

