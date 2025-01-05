import { NextRequest, NextResponse } from "next/server"
import { ObjectId } from "mongoose"
import { IResponse } from "@/shared/repository/services"
import Attendance, { IAttendance } from "@/models/attendances"

interface AttendanceParams {
  params: Promise<{
    jobId: ObjectId
    attendanceId: ObjectId
  }>
}

export async function PUT(
  req: NextRequest,
  { params }: AttendanceParams
): Promise<NextResponse<IResponse<IAttendance>>> {
  try {
    const { attendanceId } = await params
    const { status, workerId }: { status: boolean; workerId: ObjectId } =
      await req.json()

    if (status === undefined || workerId === undefined) {
      return NextResponse.json(
        { status: false, message: "Status and worker are required!" },
        { status: 400 }
      )
    }

    const attendance = await Attendance.findOneAndUpdate(
      {
        _id: attendanceId,
        "records.worker": workerId
      },
      {
        $set: {
          "records.$.status": status
        }
      },
      { new: true }
    )

    if (!attendance) {
      return NextResponse.json(
        { status: false, message: "Attendance not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { status: true, message: "Attendance Updated", data: attendance },
      { status: 200 }
    )
  } catch (error) {
    console.error(error) // log error for better debugging
    return NextResponse.json(
      { status: false, message: "Internal Server Error" },
      { status: 500 }
    )
  }
}