import { inject, provide, Ref } from 'vue'
import { Ingredient } from 'entities/Ingredient'
import { Step } from 'entities/Step'
import { Tag } from 'entities/Tag'

export type RecipeCreationIngredient = Ingredient
export type RecipeCreationStep = Step
export type RecipeCreationKitchenInventoryItem = {
 name: string,
 id: number
 amount: number
}
export type RecipeCreationTag = Tag

export type RecipeCreationModel = {
 image_url: string
 name: string

 category: number | null
 nationality: number | null
 diet_type: number | null

 hardness: number | null
 spiciness: number | null

 time_in_kitchen: number | null
 time_to_cook: number | null

 ingredients: RecipeCreationIngredient[]

 calories: number | null
 carbohydrates: number | null
 fats: number | null
 proteins: number | null

 steps: RecipeCreationStep[]

 kitchen_inventory: RecipeCreationKitchenInventoryItem[]
 tags: RecipeCreationTag[]
}

export type RecipeCreationContext = {
 model: Ref<RecipeCreationModel>
}

const CONTEXT_KEY = Symbol('RECIPE_CREATION_CONTEXT_KEY')

export const createRecipeCreationContext = (context: RecipeCreationContext) => {
  provide(CONTEXT_KEY, context)
}

export const useRecipeCreationContext = () => {
 return inject(CONTEXT_KEY) as RecipeCreationContext
}
