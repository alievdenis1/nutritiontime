import { getDietTypeList } from '../api'
import { useQuery } from '@tanstack/vue-query'

export const useDietTypeList = () => {
	const {
		data: dietTypeList,
		isLoading: isLoadingDietTypes
	} = useQuery({
		queryKey: ['dietTypes'],
		queryFn: getDietTypeList,
		initialData: []
	})

	return {
		dietTypeList,
		isLoadingDietTypes
	}
}
