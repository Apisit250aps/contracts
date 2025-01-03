import dbConnect from "@/libs/database/mongoose"
import User from "@/models/users"
import { IResponse } from "@/shared/repository/sevices"
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest): Promise<NextResponse<IResponse>> {
  try {
    await dbConnect()
    const { username, password } = await req.json()
    if (!username || !password) {
      return NextResponse.json(
        { status: false, message: "username or password invalid!" },
        { status: 400 }
      )
    }

    const existUser = await User.findOne({ username })
    if (existUser) {
      return NextResponse.json(
        { status: false, message: "User is exist!" },
        { status: 400 }
      )
    }

    const user = new User({ username, password })
    await user.save()

    return NextResponse.json(
      { status: true, message: "Register success!", data: user },
      { status: 201 }
    )
  } catch (error) {
    return NextResponse.json(
      { status: false, message: "Internal Error!" },
      { status: 500 }
    )
  }
}
