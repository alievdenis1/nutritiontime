import { FullRecipe } from 'entities/Recipe/model/recipe.ts'

const formatStringToNumber = (s: string) => {
	const num = Number(s)

	if (isNaN(num)) {
		return 0
	}

	return num
}

export const calculateRecipeWeight = ({
	ingredients
}: {
	ingredients: FullRecipe['ingredients']
}) => {
	return ingredients.reduce((acc, ingredient) => {
		const ingredientWeight = ingredient.pivot.unit === 'g'
			? formatStringToNumber(ingredient.pivot.amount)
			: 0

		return acc + ingredientWeight
	}, 0)
}
