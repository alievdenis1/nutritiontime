import { getKitchenwareList } from '../api'
import { useQuery } from '@tanstack/vue-query'
import { Kitchenware } from 'entities/Kitchenware'

export const useKitchenwareList = () => {
	const {
		data: kitchenwareList,
		isLoading: isLoadingKitchenwareList
	} = useQuery({
		queryKey: ['kitchenwareList'],
		queryFn: getKitchenwareList,

		initialData: [] as Kitchenware[]
	})

	return {
		kitchenwareList,
		isLoadingKitchenwareList
	}
}
