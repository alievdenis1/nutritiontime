import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { RecipesItem } from '@/entities/Recipe/RecipesList'
import { recipesData } from '../mocks/mocks-store'

export const useSearchStore = defineStore('search-store', () => {
    const recipes = ref<RecipesItem[]>(recipesData.value)
    const isLoading = ref(false)
    const activeTag = ref<string | null>(null)
    const modalIsActive = ref(false)
    const secondModalIsActive = ref(false)

    async function searchRecipes() {
        isLoading.value = true
        await new Promise(resolve => setTimeout(resolve, 2000))

        isLoading.value = false
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
        activeTag,
        searchRecipes,
        modalIsActive,
        secondModalIsActive,
        toggleModalOpen,
        toggleModalClose,
        toggleSecondModalOpen,
        toggleSecondModalClose
    }
})