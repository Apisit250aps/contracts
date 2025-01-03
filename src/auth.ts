import NextAuth, { User as Auth } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import User from "./models/users"

export const { auth, handlers } = NextAuth({
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      credentials: {
        username: { label: "Username" },
        password: { label: "Password" }
      },
      async authorize(credentials) {
        const { username, password } = credentials
        const user = await User.findOne({ username })
        if (!user || !user.authentication(password as string)) {
          throw new Error("Invalid username or password")
        }
        return { id: user._id, name: user.username } as Auth
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (token.id) {
        session.user.id = token.id as string
      }
      return session
    }
  }
})
