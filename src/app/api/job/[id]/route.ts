import dbConnect from "@/libs/database/mongoose"
import Job from "@/models/jobs"
import { ObjectId, Types } from "mongoose"
import { NextRequest, NextResponse } from "next/server"
interface QueryParams {
  params: Promise<{
    id: ObjectId
  }>
}
export async function GET(req: NextRequest, { params }: QueryParams) {
  try {
    await dbConnect()
    const { id } = await params
    const job = await Job.findById({ _id: id }).populate("assignedWorkers")
    return NextResponse.json({ job }, { status: 200 })
  } catch (error) {
    return NextResponse.json({}, { status: 500 })
  }
}

export async function POST(req: NextRequest, { params }: QueryParams) {
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
