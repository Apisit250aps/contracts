import dbConnect from "@/libs/database/mongoose"
import Job from "@/models/jobs"
import { Types } from "mongoose"
import { NextRequest, NextResponse } from "next/server"
import { JobParams } from "../route"

export async function POST(req: NextRequest, { params }: JobParams) {
  try {
    await dbConnect()
    const { jobId } = await params
    const { workers } = await req.json()
    const job = await Job.findByIdAndUpdate(
      { _id: jobId },
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
