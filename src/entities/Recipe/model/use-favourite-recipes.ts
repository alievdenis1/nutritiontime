import { useQuery } from '@tanstack/vue-query'
import { getFavoriteRecipeList } from 'entities/Recipe/api'

export const useFavouriteRecipes = () => {
	const {
		data: favouriteRecipes,
		isLoading: isLoadingFavouriteRecipes,
	} = useQuery({
		queryKey: ['recipes/favourite'],
		queryFn: async () => {
			const response = await getFavoriteRecipeList()
			return response.data
		},
		initialData: [],

	})

	return {
		favouriteRecipes,
		isLoadingFavouriteRecipes
	}
}
