export const RECIPE_CREATION_VARIANTS = {
	BASE: 'Base',
	AI: 'AI'
} as const satisfies Record<string, string>

export type RecipeCreationVariants = (typeof RECIPE_CREATION_VARIANTS)[keyof typeof RECIPE_CREATION_VARIANTS]
