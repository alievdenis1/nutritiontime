import type { CreateBaseRecipeModel } from './use-base-recipe-creation-validation.ts'
import { inject, provide, type Reactive, Ref } from 'vue'
import { ValidationError } from 'yup'

const CREATE_BASE_RECIPE_CREATION_CONTEXT_KEY = Symbol('CREATE_BASE_RECIPE_CREATION_CONTEXT_KEY')

type UseBaseRecipeCreationContext = {
	model: Reactive<CreateBaseRecipeModel>
	errors: Ref<Partial<Record<keyof CreateBaseRecipeModel, ValidationError>> | undefined>
	validateField(data: { key: keyof CreateBaseRecipeModel, value?: CreateBaseRecipeModel[keyof CreateBaseRecipeModel] }): void
	isLoading: Ref<boolean>
}

export const createBaseRecipeCreationContext = (context: UseBaseRecipeCreationContext) => {
	provide(CREATE_BASE_RECIPE_CREATION_CONTEXT_KEY, context)
}

export const useBaseRecipeCreationContext = () => {
	const context = inject<UseBaseRecipeCreationContext>(CREATE_BASE_RECIPE_CREATION_CONTEXT_KEY)

	if (!context) {
		throw new Error('no recipe creation context provided')
	}

	return context
}
