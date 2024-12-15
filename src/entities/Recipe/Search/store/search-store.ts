import { defineStore } from 'pinia'
import { computed, reactive, ref, toRef, watch } from 'vue'
import type { RecipesItem } from '@/entities/Recipe/RecipesList'
import { recipesData } from '../mocks/mocks-store'
import { getRecipeList, GetRecipeListRequestDto } from 'entities/Recipe/api'
import { Tag } from 'entities/Tag'
import { debouncedWatch, watchDebounced } from '@vueuse/core'
import { debounce } from 'shared/lib/utils/utils.ts'

export const useSearchStore = defineStore('search-store', () => {
    const recipes = ref<RecipesItem[]>(recipesData.value)
    const activeQuickSearchTag = ref<number | null>(null)
    const modalIsActive = ref(false)
    const secondModalIsActive = ref(false)
    const selectedIngredients = ref<Ingredient[]>([])

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
        selectedIngredients
    }
})
