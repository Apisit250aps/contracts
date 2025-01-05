import User from "@/models/users"
import Credentials from "next-auth/providers/credentials"
import dbConnect from "../database/mongoose"

export default Credentials({
  name: "credentials",
  credentials: {
    username: { label: "Username" },
    password: { label: "Password" }
  },
  async authorize(credentials) {
    try {
      await dbConnect()
      const { username, password } = credentials

      const user = await User.findOne({ username })
      console.log(user)
      if (!user) {
        throw new Error("Invalid username or password")
      }

      const isPasswordValid = await user.authentication(password as string)
      if (!isPasswordValid) {
        throw new Error("Invalid username or password")
      }

      user.lastLogin = new Date()
      await user.save()

      return { id: user._id, name: user.username }
    } catch (error) {
      console.error("Authorization Error:", error)
      return null
    }
  }
})