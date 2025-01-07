import { PaginationData } from '@/shared/lib/types/pagination-data'
import { api } from 'shared/lib/api/use-api.ts'

export type IngredientDto = {
	id: number
	name: string
}

type IngredientListParams = {
	search?: string
}

export async function getIngredientList(
	params: IngredientListParams = {},
	signal?: AbortSignal
) {
	const response = await api.get<PaginationData<IngredientDto>>(
		'/public/ingredients',
		{
			signal,
			params
		}
	)

	return response.data
}
