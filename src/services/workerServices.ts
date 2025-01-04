import { IWorker } from "@/models/workers"
import { IPagination, IResponse } from "@/shared/repository/services"
import axios, { AxiosError, AxiosResponse } from "axios"

export const fetchAllWorker = async ({
  page,
  limit
}: {
  page?: number
  limit?: number
}): Promise<
  AxiosResponse<IResponse<IWorker[]> & { pagination: IPagination }>
> => {
  try {
    const res = await axios({
      method: "get",
      url: "/api/worker",
      params: { page, limit }
    })
    return res
  } catch (error) {
    throw error
  }
}

export const createWorker = async (data: IWorker): Promise<AxiosResponse> => {
  try {
    const res = await axios({
      method: "post",
      url: "/api/worker",
      data: data
    })
    return res
  } catch (error) {
    throw error
  }
}
