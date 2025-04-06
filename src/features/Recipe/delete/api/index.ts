import { api } from '@/shared/lib/api/use-api'

/**
 * Удаление рецепта по ID
 * @param recipeId ID рецепта для удаления
 * @returns Promise с результатом операции
 */
export async function deleteRecipe(recipeId: number) {
	const response = await api.delete(`/recipes/${recipeId}`)
	return response.data
}
