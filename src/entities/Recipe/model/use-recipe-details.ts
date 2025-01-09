import { computed, Ref, toValue } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import { getRecipeDetails } from 'entities/Recipe/api'
import { calculateRecipeWeight } from 'entities/Recipe/model/weight'

export function useRecipeDetails({
	id
}: {
	id: Ref<number>
}) {
	const {
		data: recipeDetails,
		isLoading: isLoadingRecipe
	} = useQuery({
		queryKey: ['recipe/details', id],
		queryFn: async () => await getRecipeDetails({ id: toValue(id) }),
		initialData: null,
		cacheTime: 60 * 1000
	})

	/**
   * Вес в граммах
   * */
	const totalWeight = computed(() => {
		console.log('recalculate')
		if (!recipeDetails.value) {
			return 0
		}

		return calculateRecipeWeight({ ingredients: recipeDetails.value.ingredients })
	})

	/** TODO: скорее всего временно, по идее должен высчитывать бэк */
	const recipe = computed(() => {
		if (!recipeDetails.value) {
			return null
		}

		return {
			...recipeDetails.value,
			total_weight: totalWeight.value
		}
	})

	return {
		recipe,
		isLoadingRecipe
	}
}
