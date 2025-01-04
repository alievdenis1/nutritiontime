import { useQuery } from '@tanstack/vue-query'
import { getCollectionListV2 } from 'entities/Сollection/api'
import { Collection } from 'entities/Сollection/types/typesCollection.ts'

export const useCollectionList = () => {
	const {
		data: collections,
		isLoading: isLoadingCollections
	} = useQuery({
		queryKey: ['collections'],
		queryFn: getCollectionListV2,
		initialData: [] as Collection[],

	})

	return {
		collections,
		isLoadingCollections
	}
}
