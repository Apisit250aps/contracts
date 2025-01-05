import dbConnect from "@/libs/database/mongoose"
import Job, { IJob } from "@/models/jobs"
import { IWorker } from "@/models/workers"
import { IResponse, PromiseParamsId } from "@/shared/repository/services"
import { NextRequest, NextResponse } from "next/server"

export async function GET(
  req: NextRequest,
  { params }: PromiseParamsId
): Promise<NextResponse<IResponse<IJob & { assignedWorkers: IWorker[] }>>> {
  try {
    await dbConnect()
    const { id } = await params
    const jobs = await Job.findById({ _id: id }).populate("assignedWorkers")
    if (!jobs) {
      return NextResponse.json(
        { status: false, message: "Not found" },
        { status: 404 }
      )
    }
    return NextResponse.json(
      { status: true, message: "Job data", data: jobs },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(
      {
        status: false,
        message: "Internal Server Error"
      },
      { status: 500 }
    )
  }
}
