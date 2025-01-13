import { useQuery } from '@tanstack/vue-query'
import { getMyRecipes, RecipeDto } from 'entities/Recipe/api'

export const useMyRecipeList = () => {
	const {
		isLoading: isLoadingMyRecipes,
		data: myRecipeList
	} = useQuery({
		queryKey: ['recipes/my'],
		queryFn: async () => (await getMyRecipes()).data,
		initialData: [] as RecipeDto[]
	})

	return {
		isLoadingMyRecipes,
		myRecipeList
	}
}
