import { AxiosError } from "axios"
import { ObjectId } from "mongoose"

export interface IResponse<T = unknown> {
  status: boolean
  message: string
  data?: T
}

export interface IPagination {
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface ParamsId {
  params: {
    id: ObjectId
  }
}

export interface PromiseParamsId {
  params: Promise<{
    id: ObjectId
  }>
}
