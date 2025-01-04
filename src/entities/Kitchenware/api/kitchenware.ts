import { api } from '@/shared/lib/api/use-api'

type KitchenwareDto = {
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
	const response = await api.get<KitchenwareDto[]>('/public/kitchenware', {
		signal,
		params
	})

	return response.data
}
