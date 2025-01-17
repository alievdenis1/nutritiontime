import { ref } from 'vue'
import { createRecipe } from 'entities/Recipe/api'
import { ElMessage } from 'element-plus'
import type { ManageBaseRecipeModel } from './use-manage-recipe-validation.ts'
import { useRouter } from 'vue-router'

export const createBaseRecipeModel = (): ManageBaseRecipeModel => ({
	image: '',
	title: '',
	description: '',
	category_id: null,
	cuisine_id: null,
	diet_type_id: null,

	difficulty: 1,
	spiciness: 1,

	time_in_kitchen: 0,
	cooking_time: 0,

	ingredients: [],

	calories: null,
	proteins: null,
	carbohydrates: null,
	fats: null,

	steps: [],
	kitchenware: [],
	tags: []
})

/**
 * Самостоятельное создание рецепта
 * */
export const useBaseRecipeCreation = () => {
	const isLoading = ref<boolean>(false)

	const router = useRouter()

	const save = async (model: ManageBaseRecipeModel) => {
		isLoading.value = true

		try {
			const dto = {
				...model,
				total_time: model.cooking_time,
				cooking_time: model.time_in_kitchen,
				/** TODO: выпилить */
				total_weight: 1
			}

			const { message, recipe } = await createRecipe(dto)
			ElMessage.success(message)

			await router.push({
				name: 'details-recipe',
				params: {
					id: recipe.id
				}
			})
		} catch(e: unknown) {
			console.error(e)
			// TODO: валидировать ошибки с бэка
		}

		isLoading.value = false
	}

	return {
		isLoading,
		save
	}
}
