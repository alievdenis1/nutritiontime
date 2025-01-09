import { defineStore } from 'pinia'
import { computed, reactive, ref, toRef, watch } from 'vue'
import type { RecipesItem } from '@/entities/Recipe/RecipesList'
import { getRecipeList, GetRecipeListRequestDto } from 'entities/Recipe/api'
import { debounce } from 'shared/lib/utils/utils.ts'
import { Ingredient } from 'entities/Ingredient'

export const useSearchStore = defineStore('search-store', () => {
	const recipes = ref<RecipesItem[]>([])
	const activeQuickSearchTag = ref<number | null>(null)
	const modalIsActive = ref(false)
	const secondModalIsActive = ref(false)
	const selectedIngredients = ref<Ingredient[]>([])

	const addCollectionToRecipe = (recipeId: number, collectionId: number) => {
		const recipeIndex = recipes.value.findIndex(recipe => recipe.id === recipeId)

		if (recipeIndex === -1) {
			return
		}

		if (!recipes.value[recipeIndex].collectionIds) {
			recipes.value[recipeIndex].collection_ids = [collectionId]
		} else {
			recipes.value[recipeIndex].collection_ids.push(collectionId)
		}
	}

	const addRecipeToFavourite = (recipeId: number, action: 'add' | 'remove') => {
		const recipeIndex = recipes.value.findIndex(recipe => recipe.id === recipeId)

		if (recipeIndex === -1) {
			return
		}

		recipes.value[recipeIndex].is_favorited = action === 'add'

		recipes.value[recipeIndex].likes_count += (action === 'add') ? 1 : -1
	}

	const isExcludeIngredientsMode = ref(false)

	const filters = reactive<GetRecipeListRequestDto>({
		tags: [],
		search: '',
		page: 1,
		per_page: 20,

		cuisine_id: undefined,
		diet_type_id: undefined,

		min_spiciness: undefined,
		max_spiciness: undefined,

		min_difficulty: undefined,
		max_difficulty: undefined,

		min_cooking_time: undefined,
		max_cooking_time: undefined,

		min_calories: undefined,
		max_calories: undefined,
		min_fats: undefined,
		max_fats: undefined,
		min_proteins: undefined,
		max_proteins: undefined,
		min_carbohydrates: undefined,
		max_carbohydrates: undefined,

		min_rating: undefined,
		max_rating: undefined,

		excluded_ingredients: undefined,
		included_ingredients: undefined,

	})

	const searchRecipesWithDebounce = debounce(searchRecipes, 500)

	watch(() => filters, () => {
		searchRecipesWithDebounce()
	}, {
		deep: true,
	})

	const totalRecipes = ref(0)

	const resetFilters = () => {
		filters.tags = []
		filters.search = ''
		filters.page = 1
		filters.per_page = 20
		activeQuickSearchTag.value = null
	}

	const getRecipesApi = getRecipeList(toRef(() => {
		return Object.assign({}, filters, { tags: [activeQuickSearchTag.value].concat(filters.tags) })
	}))

	const isLoading = computed(() => {
		return getRecipesApi.loading.value
	})

	async function searchRecipes() {
		getRecipesApi.cancel()
		await getRecipesApi.execute()

		if (getRecipesApi.data.value) {
			recipes.value = getRecipesApi.data.value.data
			totalRecipes.value = getRecipesApi.data.value.total
		}
	}

	function toggleModalOpen() {
		modalIsActive.value = true
	}

	function toggleModalClose() {
		modalIsActive.value = false
	}

	function toggleSecondModalOpen() {
		secondModalIsActive.value = true
	}

	function toggleSecondModalClose() {
		secondModalIsActive.value = false
	}

	return {
		recipes,
		isLoading,
		activeQuickSearchTag,
		searchRecipes,
		modalIsActive,
		secondModalIsActive,
		toggleModalOpen,
		toggleModalClose,
		toggleSecondModalOpen,
		toggleSecondModalClose,
		totalRecipes,
		filters,
		isExcludeIngredientsMode,
		selectedIngredients,
		addCollectionToRecipe,
		addRecipeToFavourite
	}
})
