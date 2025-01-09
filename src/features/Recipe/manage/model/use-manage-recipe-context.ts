import type { ManageBaseRecipeModel } from './use-manage-recipe-validation.ts'
import { inject, provide, type Reactive, Ref } from 'vue'
import { ValidationError } from 'yup'

const CREATE_BASE_RECIPE_CREATION_CONTEXT_KEY = Symbol('CREATE_BASE_RECIPE_CREATION_CONTEXT_KEY')

type RecipeManageContext = {
	model: Reactive<ManageBaseRecipeModel>
	errors: Ref<Partial<Record<keyof ManageBaseRecipeModel, ValidationError>> | undefined>
	validateField(data: { key: keyof ManageBaseRecipeModel, value?: ManageBaseRecipeModel[keyof ManageBaseRecipeModel] }): void
	isLoading: Ref<boolean>
}

export const createBaseRecipeManageContext = (context: RecipeManageContext) => {
	provide(CREATE_BASE_RECIPE_CREATION_CONTEXT_KEY, context)
}

export const useBaseRecipeManageContext = () => {
	const context = inject<RecipeManageContext>(CREATE_BASE_RECIPE_CREATION_CONTEXT_KEY)

	if (!context) {
		throw new Error('no RecipeManageContext context provided')
	}

	return context
}
