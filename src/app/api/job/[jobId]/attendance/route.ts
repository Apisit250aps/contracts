import dbConnect from "@/libs/database/mongoose"
import { IResponse } from "@/shared/repository/services"
import { NextRequest, NextResponse } from "next/server"
import { JobParams } from "../route"
import Job from "@/models/jobs"
import Attendance, { IAttendance } from "@/models/attendances"
import { ObjectId } from "mongoose"

export async function POST(
  req: NextRequest,
  { params }: JobParams
): Promise<NextResponse<IResponse>> {
  try {
    await dbConnect()
    const { jobId } = await params
    const { date }: IAttendance = await req.json()
    if (!date) {
      return NextResponse.json(
        { status: false, message: "Date required" },
        { status: 400 }
      )
    }
    const job = await Job.findOne({ _id: jobId })
    if (!job) {
      return NextResponse.json(
        { status: false, message: "Job invalid" },
        { status: 404 }
      )
    }
    const existingAttendance = await Attendance.findOne({ jobId, date })
    if (existingAttendance) {
      return NextResponse.json(
        { status: false, message: "Attendance already taken on this date" },
        { status: 400 }
      )
    }
    const attendance = new Attendance({
      date,
      jobId,
      records: job.assignedWorkers.map((w: ObjectId) => ({
        worker: w,
        status: false
      }))
    })
    await attendance.save()
    return NextResponse.json(
      { status: true, message: "Attendance success" },
      { status: 201 }
    )
  } catch (error) {
    return NextResponse.json(
      { status: true, message: "Internal Server Error" },
      { status: 500 }
    )
  }
}

export async function GET(
  req: NextRequest,
  { params }: JobParams
): Promise<NextResponse<IResponse<IAttendance[]>>> {
  try {
    await dbConnect()
    const { jobId } = await params
    const attendances = await Attendance.find({ jobId }).sort({ date: 1 })
    return NextResponse.json(
      {
        status: true,
        message: "Attendances fetched successfully",
        data: attendances
      },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(
      { status: false, message: "Internal Server Error" },
      { status: 500 }
    )
  }
}
