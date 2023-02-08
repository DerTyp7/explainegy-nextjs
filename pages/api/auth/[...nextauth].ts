import NextAuth, { AuthOptions } from "next-auth"
import GithubProvider from "next-auth/providers/github"
export const authOptions: AuthOptions = {
  // Configure one or more authentication providers
  providers: [
    GithubProvider({
      clientId: "1afc604704e6ac0149e3", //! env vars
      clientSecret: "b8f76990fc0a9181eaba23359a27b2d140ab67e7",  //! env vars
    }),
    // ...add more providers here
  ], callbacks: {
    async signIn({ user, account, profile, email, credentials }) {

      if (user.id.toString() == "76851529") { //! env vars
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

