import dbConnect from "@/libs/database/mongoose"
import Job, { IJob } from "@/models/jobs"
import { IPagination, IResponse } from "@/shared/repository/services"
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest): Promise<NextResponse<IResponse>> {
  try {
    await dbConnect()
    const { title, description } = await req.json()
    if (!title || !description) {
      return NextResponse.json(
        { status: false, message: "Title and description is required!" },
        { status: 400 }
      )
    }
    const newJob = new Job({ title, description })
    newJob.save()
    return NextResponse.json(
      { status: true, message: "Created new job!", data: newJob },
      { status: 201 }
    )
  } catch (error) {
    console.log(error)
    return NextResponse.json(
      { status: false, message: "Server Error!" },
      { status: 500 }
    )
  }
}

export async function GET(
  req: NextRequest
): Promise<NextResponse<IResponse<IJob[]> & { pagination?: IPagination }>> {
  try {
    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get("page") || "1", 10)
    const limit = parseInt(searchParams.get("limit") || "10", 10)

    const skip = (page - 1) * limit
    const [job, total] = await Promise.all([
      Job.find({}).skip(skip).limit(limit),
      Job.countDocuments()
    ])
    //
    return NextResponse.json(
      {
        status: true,
        message: "All Jobs",
        data: job,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit)
        }
      },
      { status: 200 }
    )
  } catch (error) {
    console.log(error)
    return NextResponse.json(
      { status: false, message: "Server Error!" },
      { status: 500 }
    )
  }
}
