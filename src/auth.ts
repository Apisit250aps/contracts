import NextAuth, { User as Auth } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import User from "./models/users"
import dbConnect from "./libs/database/mongoose"

export const { auth, handlers } = NextAuth({
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        username: { label: "Username" },
        password: { label: "Password" }
      },
      async authorize(credentials) {
        try {
          await dbConnect()
          const { username, password } = credentials

          // Find user by username
          const user = await User.findOne({ username })
          console.log(user)
          if (!user) {
            throw new Error("Invalid username or password")
          }

          // Validate the password
          const isPasswordValid = await user.authentication(password as string)
          if (!isPasswordValid) {
            throw new Error("Invalid username or password")
          }

          // Update last login time
          user.lastLogin = new Date()
          await user.save()

          // Return authenticated user information
          return { id: user._id, name: user.username }
        } catch (error) {
          console.error("Authorization Error:", error)
          return null
        }
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
