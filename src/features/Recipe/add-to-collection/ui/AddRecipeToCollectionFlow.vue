<template>
	<SelectionStep
		v-if="currentStep === STEPS.SELECT"
		v-loading="isLoading"
		@next="goToNextStep"
		@close="onClose"
		@save="onSaveToSelectedCollection"
	/>

	<CreationStep
		v-else-if="currentStep === STEPS.CREATE_NEW"
		v-loading="isLoading"
		@back="goToPreviousStep"
		@close="onClose"
		@save="onCreateCollectionAndSaveRecipe"
	/>
</template>

<script setup lang="ts">
import { CreationStep, SelectionStep } from 'features/Recipe/add-to-collection/ui/steps'
import {
	STEPS,
	useAddRecipeToCollectionSteps
} from 'features/Recipe/add-to-collection/model/use-add-recipe-to-collection-steps.ts'
import { useAddRecipeToCollection } from 'features/Recipe/add-to-collection/model/use-add-recipe-to-collection.ts'
import { ref } from 'vue'
import type { Recipe } from 'entities/Recipe'
import { useQueryClient } from '@tanstack/vue-query'

const emit = defineEmits<{
	success: [{ collectionId: number, recipeId: number }]
}>()

const {
	currentStep,
	goToPreviousStep,
	goToNextStep,
	init,
	reset
} = useAddRecipeToCollectionSteps()

const {
	saveToExistingCollection,
	isLoading,
	createCollectionAndSaveRecipe,
} = useAddRecipeToCollection()

type RecipeInfo = Pick<Recipe, 'id' | 'collection_ids'>

const recipeInfo = ref<RecipeInfo | null>(null)

function resetAllData() {
	reset()
	recipeInfo.value = null
}

async function onSaveToSelectedCollection(id: number) {
	if (!recipeInfo.value) {
		console.error('recipe info is nullish')
		return
	}

	const { collectionId, recipeId } = await saveToExistingCollection({
		recipe: recipeInfo.value,
		collectionId: id
	})

	if (collectionId && recipeId) {
		emit('success', { collectionId, recipeId })
		resetAllData()
	}
}

async function onCreateCollectionAndSaveRecipe(collectionName: string) {
	if (!recipeInfo.value) {
		console.error('recipe info is nullish')
		return
	}

	const { collectionId, recipeId } = await createCollectionAndSaveRecipe({
		recipe: recipeInfo.value,
		collectionName
	})

	if (collectionId && recipeId) {
		emit('success', { collectionId, recipeId })
		resetAllData()
	}
}

function onClose() {
	resetAllData()
}

function start(info: RecipeInfo) {
	recipeInfo.value = info
	init()
}

defineExpose({
	start
})
</script>

<style scoped lang="scss">

</style>
