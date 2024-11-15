import useApi from '@/shared/lib/api/use-api'
import { PaginationData } from '@/shared/lib/types/pagination-data'

type TagDto = {
    id: number;
    name: string;
    category: string;
}

export type TagList = TagDto[]

type TagListParams = {
    search?: string;
    category?: string;
}

export function getTagList(params: TagListParams) {
    return useApi<PaginationData<TagList>>('get', '/public/tags', params)
}
