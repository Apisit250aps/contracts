export interface IResponse<T=unknown> {
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
