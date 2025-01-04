import { getTagList } from '../api'
import { useQuery } from '@tanstack/vue-query'

export const useTagList = () => {
	const { isLoading: isLoadingTags, data: tagList } = useQuery({
		queryKey: ['tagList'],
		queryFn: async () => {
			const response = await getTagList()
			return response.data
		},
		initialData: [],
	})

	return {
		tagList,
		isLoadingTags
	}
}
