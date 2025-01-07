import { ref } from 'vue'
import { toggleFavourite } from 'entities/Recipe/api'
import { defineStore } from 'pinia'

export const useRecipeLikeStore = defineStore('recipe-like-store', () => {
	/** Рецепты по которым сейчас отправляется лайк */
	const recipesWithPendingLike = ref(new Map<number, AbortController>())

	/** Поменять лайк рецепта. Предыдущий запрос по id рецепта абортится, отправляется новый. */
	const likeRecipe = async (recipeId: number) => {
		if (recipesWithPendingLike.value.has(recipeId)) {
			recipesWithPendingLike.value.get(recipeId)?.abort()
		}

		recipesWithPendingLike.value.set(recipeId, new AbortController())

		const response = await toggleFavourite(
			recipeId,
			recipesWithPendingLike.value.get(recipeId)?.signal
		)

		recipesWithPendingLike.value.delete(recipeId)

		return response.isFavourited
	}

	return {
		recipesWithPendingLike,
		likeRecipe
	}
})
