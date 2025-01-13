import {
 RecipeCreationIngredient,
 RecipeCreationKitchenInventoryItem, RecipeCreationModel,
 RecipeCreationStep, RecipeCreationTag
} from 'features/create-recipe/model/recipe-creation-context.ts'
import { ref } from 'vue'

const createInitialRecipeCreationModel = (): RecipeCreationModel => ({
 image_url: '',
 name: '',
 category: null,
 nationality: null,
 diet_type: null,

 hardness: null,
 spiciness: null,

 time_in_kitchen: null,
 time_to_cook: null,

 ingredients: [],

 calories: null,
 carbohydrates: null,
 fats: null,
 proteins: null,

 steps: [],

 kitchen_inventory: [],
 tags: []
})

export const useRecipeCreation = () => {
  const model = ref(createInitialRecipeCreationModel())

  function resetModel() {
   model.value = createInitialRecipeCreationModel()
  }

  return {
   model,
   resetModel
  }
}
