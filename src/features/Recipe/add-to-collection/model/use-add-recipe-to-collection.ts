import { ref } from 'vue'
import { updateRecipeCollections } from 'entities/Recipe/api'
import { Recipe } from 'entities/Recipe'
import { createCollectionV2 } from 'entities/Сollection/api'

export const useAddRecipeToCollection = () => {
	const isLoading = ref(false)

	const saveToExistingCollection = async (data: {
		recipe: Pick<Recipe, 'id' | 'collection_ids'>
		collectionId: number
	}) => {
		isLoading.value = true

		const newCollectionList = [...new Set(data.recipe.collection_ids.concat([data.collectionId]))]

		let collectionId = null
		let recipeId = null

		try {
			await updateRecipeCollections({
				id: data.recipe.id,
				collection_ids: newCollectionList
			})

			collectionId = data.collectionId
			recipeId = data.recipe.id
		} catch(error) {
			console.error(error)
		}

		isLoading.value = false

		return {
			collectionId,
			recipeId
		}
	}

	const createCollectionAndSaveRecipe = async (data: {
		recipe: Pick<Recipe, 'id' | 'collection_ids'>
		collectionName: string
	}) => {
		isLoading.value = true

		let collectionId = null
		let recipeId = null

		try {
			const { collection: newCollection } = await createCollectionV2({ name: data.collectionName })

			const newCollectionList = [...new Set(data.recipe.collection_ids.concat([newCollection.id]))]

			await updateRecipeCollections({
				id: data.recipe.id,
				collection_ids: newCollectionList
			})

			collectionId = newCollection.id
			recipeId = data.recipe.id
		} catch(error) {
			console.error(error)
		}

		isLoading.value = false

		return {
			collectionId,
			recipeId
		}
	}

	return {
		isLoading,
		saveToExistingCollection,
		createCollectionAndSaveRecipe,
	}
}
