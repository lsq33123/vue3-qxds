/** @format */

export type HttpResponse<T> = Promise<{
  errcode: number
  errmsg: string
  result?: T
}>
