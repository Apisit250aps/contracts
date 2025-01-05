import NextAuth from "next-auth"
import Credentials from "./libs/providers/credentials";

export const { auth, handlers } = NextAuth({
  session: { strategy: "jwt", maxAge: 60 * 60 * 24 },
  providers: [Credentials],
})
