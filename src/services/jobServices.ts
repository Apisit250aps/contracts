import { IJob } from "@/models/jobs"
import { IWorker } from "@/models/workers"
import { IPagination, IResponse } from "@/shared/repository/services"
import axios, { AxiosError, AxiosResponse } from "axios"

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
