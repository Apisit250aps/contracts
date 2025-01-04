export interface IResponse {
  status: boolean
  message: string
  data?: any
}

export interface IPagination {
  total: number
  page: number
  limit: number
  totalPages: number
}
