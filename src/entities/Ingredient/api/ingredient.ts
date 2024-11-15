import useApi from '@/shared/lib/api/use-api'
import { PaginationData } from '@/shared/lib/types/pagination-data'

type IngredientDto = {
    id: number;
    name: string;
}

export type IngredientList = IngredientDto[]

type IngredientListParams = {
    search?: string;
}

export function getIngredientList(params: IngredientListParams) {
    return useApi<PaginationData<IngredientList>>('get', '/public/ingredients', params)
}
