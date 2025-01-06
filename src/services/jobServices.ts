import { IAttendance } from "@/models/attendances"
import { IJob } from "@/models/jobs"
import { IWorker } from "@/models/workers"
import { IPagination, IResponse } from "@/shared/repository/services"
import axios, { AxiosError, AxiosResponse } from "axios"
import { ObjectId } from "mongoose"

export async function fetchAllJob({
  page,
  limit
}: {
  page?: number
  limit?: number
}): Promise<IResponse<IJob[]> & { pagination?: IPagination }> {
  try {
    const response = await axios({
      method: "get",
      url: "/api/job",
      params: { page, limit }
    })
    return {
      status: true,
      message: response.data.message,
      data: response.data.data,
      pagination: response.data.pagination
    }
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      return {
        status: false,
        message: error.response?.data.message
      }
    }
    return {
      status: false,
      message: error instanceof Error ? error.message : "Unknown error"
    }
  }
}

export async function updatedJob(job: IJob): Promise<IResponse<IJob>>{
  try {
    const response = await axios({
      method: "put",
      url: `/api/job/${job._id}`,
      data: job
    })
    return {
      status: true,
      message: response.data.message,
      data: response.data.data
    }
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      return {
        status: false,
        message: error.response?.data.message
      }
    }
    return {
      status: false,
      message: error instanceof Error? error.message : "Unknown error"
    }
  }
}

export async function deleteJob(id: string): Promise<IResponse<string>> {
  try {
    const response = await axios({
      method: "delete",
      url: `/api/job/${id}`
    })
    return {
      status: true,
      message: response.data.message,
      data: response.data.data
    }
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      return {
        status: false,
        message: error.response?.data.message
      }
    }
    return {
      status: false,
      message: error instanceof Error? error.message : "Unknown error"
    }
  }
}

export async function createJob(data: IJob): Promise<IResponse<IJob[]>> {
  try {
    const response = await axios({
      method: "post",
      url: "/api/job",
      data: data
    })
    return {
      status: true,
      message: response.data.message,
      data: response.data.data
    }
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      return {
        status: false,
        message: error.response?.data.message
      }
    }
    return {
      status: false,
      message: error instanceof Error ? error.message : "Unknown error"
    }
  }
}

export async function getJob(
  id: string
): Promise<IResponse<IJob & { assignedWorkers: IWorker[] }>> {
  try {
    const response = await axios(`/api/job/${id}`)
    return {
      status: true,
      message: response.data.message,
      data: response.data.data
    }
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      return {
        status: false,
        message: error.response?.data.message
      }
    }
    return {
      status: false,
      message: error instanceof Error ? error.message : "Unknown error"
    }
  }
}

export async function assignJob(
  id: string,
  workers: IWorker[]
): Promise<IResponse> {
  try {
    const workersId = workers.map((w: IWorker) => w._id)
    const response = await axios({
      method: "post",
      url: `/api/job/${id}/assign`,
      data: {
        workers: workersId
      }
    })
    return {
      status: true,
      message: response.data.message,
      data: response.data.data
    }
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      return {
        status: false,
        message: error.response?.data.message
      }
    }
    return {
      status: false,
      message: error instanceof Error ? error.message : "Unknown error"
    }
  }
}

export async function createAttendance({
  jobId,
  attendance
}: {
  jobId: string
  attendance: IAttendance
}): Promise<IResponse> {
  try {
    const response = await axios({
      method: "post",
      url: `/api/job/${jobId}/attendance`,
      data: attendance
    })
    return {
      status: true,
      message: response.data.message,
      data: response.data.data
    }
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      return {
        status: false,
        message: error.response?.data.message
      }
    }
    return {
      status: false,
      message: error instanceof Error ? error.message : "Unknown error"
    }
  }
}

export async function getAttendance(
  jobId: string
): Promise<IResponse<IAttendance[]>> {
  try {
    const response = await axios({
      method: "get",
      url: `/api/job/${jobId}/attendance`
    })
    return {
      status: true,
      message: response.data.message,
      data: response.data.data
    }
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      return {
        status: false,
        message: error.response?.data.message
      }
    }
    return {
      status: false,
      message: error instanceof Error ? error.message : "Unknown error"
    }
  }
}

export async function checkAttendance({
  jobId,
  attendanceId,
  workerId,
  status
}: {
  jobId: ObjectId
  attendanceId: ObjectId
  workerId: ObjectId
  status: boolean
}): Promise<IResponse> {
  try {
    const response = await axios({
      method: "put",
      url: `/api/job/${jobId}/attendance/${attendanceId}`,
      data: {
        workerId,
        status
      }
    })

    return {
      status: true,
      message: response.data.message,
      data: response.data
    }
  } catch (error) {
    if (error instanceof AxiosError) {
      return {
        status: false,
        message: error.response?.data.message
      }
    }
    return {
      status: false,
      message: error instanceof Error ? error.message : "Unknown error"
    }
  }
}

export async function deleteAttendance({
  jobId,
  attendanceId
}: {
  jobId: string
  attendanceId: string
}): Promise<IResponse> {
  try {
    const response = await axios({
      method: "delete",
      url: `/api/job/${jobId}/attendance/${attendanceId}`
    })
    return {
      status: true,
      message: response.data.message,
      data: response.data
    }
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      return {
        status: false,
        message: error.response?.data.message
      }
    }
    return {
      status: false,
      message: error instanceof Error ? error.message : "Unknown error"
    }
  }
}
