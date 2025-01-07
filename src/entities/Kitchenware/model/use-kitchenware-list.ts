import { getKitchenwareList } from '../api'
import { useQuery } from '@tanstack/vue-query'
import type { KitchenwareDto } from 'entities/Kitchenware/api/kitchenware.ts'

export const useKitchenwareList = () => {
	const {
		data: kitchenwareList,
		isLoading: isLoadingKitchenwareList
	} = useQuery({
		queryKey: ['kitchenwareList'],
		queryFn: async () => {
			const response = await getKitchenwareList()
			return response.data
		},
		initialData: [] as KitchenwareDto[]
	})

	return {
		kitchenwareList,
		isLoadingKitchenwareList
	}
}
