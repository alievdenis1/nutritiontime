import { getCuisineList } from '../api/cuisine.ts'
import { useQuery } from '@tanstack/vue-query'

export const useCuisineList = () => {
	const { isLoading: isLoadingCuisines, data: cuisines } = useQuery({
		queryKey: ['cuisines'],
		queryFn: getCuisineList,

		initialData: []
	})

	return {
		isLoadingCuisines,
		cuisines
	}
}
