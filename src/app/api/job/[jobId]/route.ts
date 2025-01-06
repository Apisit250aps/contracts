import dbConnect from "@/libs/database/mongoose"
import Job, { IJob } from "@/models/jobs"
import { IWorker } from "@/models/workers"
import { IResponse, PromiseParamsId } from "@/shared/repository/services"
import { ObjectId } from "mongoose"
import { NextRequest, NextResponse } from "next/server"
export interface JobParams {
  params: Promise<{
    jobId: ObjectId
  }>
}
export async function GET(
  req: NextRequest,
  { params }: JobParams
): Promise<NextResponse<IResponse<IJob & { assignedWorkers: IWorker[] }>>> {
  try {
    await dbConnect()
    const { jobId } = await params
    const jobs = await Job.findById({ _id: jobId }).populate("assignedWorkers")
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

export async function PUT(
  req: NextRequest,
  { params }: JobParams
): Promise<NextResponse<IResponse<IJob>>> {
  try {
    const { jobId } = await params
    const { title, description } = await req.json()
    const updatedJob = await Job.findByIdAndUpdate(
      jobId,
      { title, description },
      { new: true }
    )
    if (!updatedJob) {
      return NextResponse.json(
        { status: false, message: "Not found" },
        { status: 404 }
      )
    }
    return NextResponse.json(
      { status: true, message: "Job updated successfully", data: updatedJob },
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

export async function DELETE(
  req: NextRequest,
  { params }: JobParams
): Promise<NextResponse<IResponse<string>>> {
  try {
    const { jobId } = await params
    const deletedJob = await Job.findByIdAndDelete(jobId)
    if (!deletedJob) {
      return NextResponse.json(
        { status: false, message: "Not found" },
        { status: 404 }
      )
    }
    return NextResponse.json(
      { status: true, message: "Job deleted successfully" },
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