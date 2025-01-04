import { api } from '@/shared/lib/api/use-api'

type CuisineDto = {
  id: number
  name: string
}

export type CuisineList = CuisineDto[]

/**
 * Получени списка видов кухонь
 * */
export const getCuisineList = async (params: { signal?: AbortSignal } = {}) => {
  const response = await api.get<CuisineDto[]>('/public/cuisines', {
    signal: params.signal
  })
  return response.data
}
