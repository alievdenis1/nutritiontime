import { getCategoryList } from '../api'
import { useQuery } from '@tanstack/vue-query'

export const useCategoryList = () => {
	const {
		data: categoryList,
		isLoading: isLoadingCategories,
	} = useQuery({
		queryKey: ['categoryList'],
		queryFn: async () => {
			return await getCategoryList()
		},

		initialData: []
	})

	return {
		categoryList,
		isLoadingCategories,
	}
}
