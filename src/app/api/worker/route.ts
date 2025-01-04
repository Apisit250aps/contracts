import dbConnect from "@/libs/database/mongoose"
import Worker from "@/models/workers"
import { IPagination, IResponse } from "@/shared/repository/services"
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest): Promise<NextResponse<IResponse>> {
  try {
    await dbConnect()
    const { name, contact } = await req.json()
    const newWorker = new Worker({ name, contact })
    newWorker.save()
    return NextResponse.json(
      { status: true, message: "Create Worker Successfully!" },
      { status: 201 }
    )
  } catch (error) {
    return NextResponse.json(
      { status: false, message: "Server Error" },
      { status: 500 }
    )
  }
}
export async function GET(
  req: NextRequest
): Promise<NextResponse<IResponse & { pagination?: IPagination }>> {
  try {
    await dbConnect()
    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get("page") || "1", 10)
    const limit = parseInt(searchParams.get("limit") || "10", 10)

    const skip = (page - 1) * limit

    const [workers, total] = await Promise.all([
      Worker.find({}).skip(skip).limit(limit),
      Worker.countDocuments()
    ])

    return NextResponse.json(
      {
        status: true,
        message: "All Workers",
        data: workers,
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
      { status: false, message: "Server Error" },
      { status: 500 }
    )
  }
}
