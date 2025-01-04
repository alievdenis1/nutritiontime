import { api } from '@/shared/lib/api/use-api'

type DietDto = {
  id: number
  name: string
}

export type DietList = DietDto[]

/**
 * Получение списка типов диет
 * */
export async function getDietTypeList({
  signal
}: { signal?: AbortSignal } = {}) {
  const response = await api.get('/public/diet-types', { signal })
  return response.data
}
