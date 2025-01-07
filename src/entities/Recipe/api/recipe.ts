import useApi, { api } from '@/shared/lib/api/use-api'
import { PaginationData } from '@/shared/lib/types/pagination-data'

import { MaybeRefOrGetter } from 'vue'

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
	id: string;
}

export function getRecipe(params: RecipeParams) {
	return useApi<RecipeDto>('get', `/recipes/${params.id}`)
}

export function getMyRecipeList() {
	return useApi<PaginationData<RecipeDto>>('get', '/recipes/my')
}

export async function getFavoriteRecipeList() {
	const response = await api.get<RecipeDto[]>('/recipes/favorites')
	return response.data
}

export async function toggleFavourite(recipeId: number, signal?: AbortSignal) {
	const response = await api.post<{ isFavourited: boolean }>(`/recipes/${recipeId}/favorite`, {
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
