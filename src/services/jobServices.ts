import { IJob } from "@/models/jobs"
import { IPagination, IResponse } from "@/shared/repository/services"
import axios, { AxiosError, AxiosResponse } from "axios"

export async function fetchAllJob({
  page,
  limit
}: {
  page?: number
  limit?: number
}): Promise<AxiosResponse<IResponse<IJob[]> & { pagination: IPagination }>> {
  try {
    const res = await axios({
      method: "get",
      url: "/api/job",
      params: { page, limit }
    })
    return res
  } catch (error) {
    throw error
  }
}

export async function createJob(
  data: IJob
): Promise<AxiosResponse<IResponse> | AxiosError> {
  try {
    const res = await axios({
      method: "post",
      url: "/api/job",
      data: data
    })
    return res
  } catch (error) {
    throw error
  }
}
