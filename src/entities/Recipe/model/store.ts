import { defineStore } from 'pinia'

interface Recipe {
    id: number;
}

interface State {
    recipe: TestRecipe | null
}

export const useRecipeStore = defineStore('recipe', {
    state: (): State => {
        return {
            recipe: null,
        }
    },
    getters: {

    },
    actions: {

    },
})

interface TestRecipe {
    id: string;
    title: string,
    description: string,
    image: string,
    author_id: string,
    category_id: string,
    cuisine_id: string,
    diet_type_id: string,
    difficulty: string,
    spiciness: string,
    cooking_time: string,
    total_time: string,
    calories: string,
    proteins: string,
    fats: string,
    carbohydrates: string,
    total_weight: string,
}