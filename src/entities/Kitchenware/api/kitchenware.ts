import { api } from '@/shared/lib/api/use-api'
import { PaginationData } from 'shared/lib/types/pagination-data.ts'

export type KitchenwareDto = {
	id: number
	name: string
}

export type KitchenwareList = KitchenwareDto[]

type KitchenwareListParams = {
	search?: string
}

export async function getKitchenwareList(
	params: KitchenwareListParams = {},
	signal?: AbortSignal
) {
	const response = await api.get<PaginationData<KitchenwareDto>>('/public/kitchenware', {
		signal,
		params
	})

	return response.data
}
