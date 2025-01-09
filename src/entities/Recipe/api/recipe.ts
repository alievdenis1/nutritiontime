import useApi, { api } from '@/shared/lib/api/use-api'
import { PaginationData } from '@/shared/lib/types/pagination-data'

import { MaybeRefOrGetter } from 'vue'
import { Author } from 'entities/Recipe/DetailedCardRecipe/types/recipe.ts'

export interface RecipeDto {
	'id': number,
	'title': string,
	'description': string,
	'image': string, // url
	'author_id': number,
	'category_id': number,
	'cuisine_id': number,
	'diet_type_id': number,
	'difficulty': number,
	'spiciness': number,
	'cooking_time': number,
	'total_time': number,
	'calories': number,
	'proteins': number,
	'fats': number,
	'carbohydrates': number,
	'total_weight': number,
	'created_at': string,
	'updated_at': string,
	'likes_count': number,
	'total_comments_count': number,
	'average_rating': number | null,
	'is_favorited': boolean,
	'collection_ids': number[],
	'category': {
		'id': number,
		'name': string,
		'created_at': string | null,
		'updated_at': string | null
	},
	'cuisine': {
		'id': number,
		'name': string,
		'created_at': string | null,
		'updated_at': string | null
	},
	'diet_type': {
		'id': number,
		'name': string,
		'created_at': string | null,
		'updated_at': string | null
	},
	'pivot': {
		'collection_id': number,
		'recipe_id': number,
		'created_at': string | null,
		'updated_at': string | null
	}
}

export type IngredientDto = {
	'id': number,
	'name': string,
	'created_at': string,
	'updated_at': string,
	'pivot': {
		'recipe_id': number,
		'ingredient_id': number,
		'amount': number,
		'unit': 'g' | 'pcs',
		'created_at': string,
		'updated_at': string
	}
}

type TagDto = {
	'id': number,
	'name': string,
	'category': string,
	'created_at': string,
	'updated_at': string,
	'pivot': {
		'recipe_id': number,
		'tag_id': number,
		'created_at': string,
		'updated_at': string
	}
}

type KitchenwareDto = {
	'id': number,
	'name': string,
	'created_at': string,
	'updated_at': '2024-10-22T13:15:27.000000Z',
	'pivot': {
		'recipe_id': number,
		'kitchenware_item_id': number,
		'quantity': number,
		'created_at': string,
		'updated_at': string
	}
}

export type FullRecipeDto = RecipeDto & {
	author: Author
	ingredients: IngredientDto[]
	tags: TagDto[],
	kitchenware: KitchenwareDto[]
}

export type GetRecipeListRequestDto = {
	search?: string
	category_id?: string
	cuisine_id?: string
	diet_type_id?: string

	min_difficulty?: number
	max_difficulty?: number

	min_spiciness?: number
	max_spiciness?: number

	min_cooking_time?: number
	max_cooking_time?: number

	min_calories?: number
	max_calories?: number
	min_proteins?: number
	max_proteins?: number
	min_fats?: number
	max_fats?: number
	min_carbohydrates?: number
	max_carbohydrates?: number

	min_rating?: number
	max_rating?: number

	required_ingredients?: number
	excluded_ingredients?: number

	tags?: number[]

	sort_by?: string
	created_at?: string
	title?: string
	cooking_time?: number
	calories?: number
	likes_count?: number

	sort_direction?: 'asc' | 'desc'
	per_page?: number
	page?: number
}

export function getRecipeList(params: MaybeRefOrGetter<GetRecipeListRequestDto>) {
	return useApi<PaginationData<RecipeDto>>('get', '/recipes', params)
}

type RecipeParams = {
	id: number;
}

export function getRecipe(params: RecipeParams) {
	return useApi<RecipeDto>('get', `/recipes/${params.id}`)
}

export async function getRecipeDetails(params: RecipeParams, signal?: AbortSignal) {
	const response = await api.get<{ recipe: FullRecipeDto }>(`/recipes/${params.id}`, {
		signal
	})
	return response.data.recipe
}

export function getMyRecipeList() {
	return useApi<PaginationData<RecipeDto>>('get', '/recipes/my')
}

export async function getMyRecipes() {
	const response = await api.get<PaginationData<RecipeDto[]>>('/recipes/my')
	return response.data
}

export async function getFavoriteRecipeList() {
	const response = await api.get<PaginationData<RecipeDto[]>>('/recipes/favorites')
	return response.data
}

export async function toggleFavourite(recipeId: number, signal?: AbortSignal) {
	const response = await api.post<{ is_favorited: boolean }>(`/recipes/${recipeId}/favorite`, {
		signal
	})
	return response.data
}

/** TODO: типизировать */
export type CreateRecipeDto = Record<string, any>

export async function createRecipe(recipeDto: CreateRecipeDto) {
	const response = await api.postForm<{ message: string, recipe: RecipeDto }>('/recipes', recipeDto)
	return response.data
}

export type UpdateRecipeCollectionsDto = {
	id: number,
	collection_ids: number[]
}

export async function updateRecipeCollections(dto: CreateRecipeDto) {
	const response = await api.post(`/recipes/${dto.id}/collections`, {
		collection_ids: dto.collection_ids
	})

	return response.data
}
