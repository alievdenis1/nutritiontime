import { useQuery } from '@tanstack/vue-query'
import { getIngredientList, Ingredient } from 'entities/Ingredient'

export const useIngredientList = () => {
	const {
		isLoading: isLoadingIngredients,
		data: ingredientList
	} = useQuery({
		queryKey: ['ingredients'],
		queryFn: async () => {
			const response = await getIngredientList()
			return response.data
		},

		initialData: [] as Ingredient[]
	})

	return {
		isLoadingIngredients,
		ingredientList
	}
}
