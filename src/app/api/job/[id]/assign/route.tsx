import dbConnect from "@/libs/database/mongoose"
import Job from "@/models/jobs"
import { PromiseParamsId } from "@/shared/repository/services"
import { Types } from "mongoose"
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest, { params }: PromiseParamsId) {
  try {
    await dbConnect()
    const { id } = await params
    const { workers } = await req.json()
    const job = await Job.findByIdAndUpdate(
      { _id: id },
      {
        $set: {
          assignedWorkers: workers.map((w: string) => new Types.ObjectId(w))
        }
      },
      { new: true }
    )

    return NextResponse.json({ job }, { status: 200 })
  } catch (error) {
    return NextResponse.json({}, { status: 500 })
  }
}
