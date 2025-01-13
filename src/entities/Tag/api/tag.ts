import { api } from '@/shared/lib/api/use-api'
import { PaginationData } from '@/shared/lib/types/pagination-data'

type TagDto = {
  id: number
  name: string
  category: string
}

export type TagListParams = {
  search?: string
  category?: string
}

export async function getTagList(
  params: TagListParams = {},
  signal?: AbortSignal
) {
  const response = await api.get<PaginationData<TagDto>>('/public/tags', {
    params,
    signal
  })

  return response.data
}
