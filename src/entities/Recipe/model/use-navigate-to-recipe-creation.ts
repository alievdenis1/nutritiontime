import { useRouter } from 'vue-router'

export const RECIPE_CREATION_VARIANTS = {
	BASE: 'Base',
	AI: 'AI'
} as const satisfies Record<string, string>

export type RecipeCreationVariants = (typeof RECIPE_CREATION_VARIANTS)[keyof typeof RECIPE_CREATION_VARIANTS]

export const useNavigateToRecipeCreation = () => {
	const router = useRouter()

	const goToRecipeCreation = (variant: RecipeCreationVariants) => {
		console.log(variant)
		return router.push({
			name: 'create-recipe',
			query: {
				variant
			}
		})
	}

	return {
		goToRecipeCreation,
		RECIPE_CREATION_VARIANTS
	}
}
