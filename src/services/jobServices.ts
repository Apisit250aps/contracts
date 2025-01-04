import { IJob } from "@/models/jobs"
import { IPagination, IResponse } from "@/shared/repository/services"
import axios, { AxiosResponse } from "axios"

export async function createJob(data: IJob): Promise<AxiosResponse<IResponse>> {
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
