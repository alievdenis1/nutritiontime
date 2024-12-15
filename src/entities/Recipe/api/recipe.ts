import useApi from '@/shared/lib/api/use-api'
import { PaginationData } from '@/shared/lib/types/pagination-data'

import { Recipe } from '../model'
import { MaybeRefOrGetter } from 'vue'

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
    return useApi<PaginationData<Recipe>>('get', '/recipes', params)
}

type RecipeParams = {
    id: string;
}

export function getRecipe(params: RecipeParams) {
    return useApi<Recipe>('get', `/recipes/${params.id}`)
}

export function getMyRecipeList() {
    return useApi<PaginationData<Recipe>>('get', '/recipes/my')
}

export function getFavoriteRecipeList() {
    return useApi<PaginationData<Recipe>>('get', '/recipes/favorites')
}
