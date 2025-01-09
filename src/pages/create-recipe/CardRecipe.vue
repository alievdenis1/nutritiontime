<template>
	<DetailCardRecipe
		v-if="recipeId"
		:recipe-id="recipeId"
	>
		<template #toggleFavourite="{ recipe, invertBackground }">
			<template v-if="recipe">
				<FavoriteButton
					:invert-background="invertBackground"
					:model-value="recipe.is_favorited"
					:recipe-id="recipe.id"
					:likes="recipe.likes_count"
					with-background
					@success="onRecipeSuccessfullyToggledFavourite"
				/>
			</template>
		</template>

		<template #addToCollection="{ recipe, invertBackground }">
			<template v-if="recipe">
				<AddRecipeToCollectionButton
					:invert-background="invertBackground"
					with-background
					:recipe="recipe"
					@click="onStartAddRecipeToCollectionFlow(recipe)"
				/>
			</template>
		</template>

		<template #shareRecipe="{ recipe, invertBackground }">
			<template v-if="recipe">
				<ShareRecipe
					:invert-background="invertBackground"
					:recipe="recipe"
				/>
			</template>
		</template>
	</DetailCardRecipe>

	<AddRecipeToCollectionFlow
		ref="addRecipeToCollectionFlowRef"
		@success="onRecipeSuccessfullyAddedToCollection"
	/>
</template>

<script setup lang="ts">
import DetailCardRecipe from 'entities/Recipe/ui/Details/DetailCardRecipe.vue'
import { useRoute } from 'vue-router'
import { computed, ref } from 'vue'
import FavoriteButton from 'features/Recipe/toggle-favourite/ui/FavoriteButton/FavoriteButton.vue'
import { AddRecipeToCollectionFlow, AddRecipeToCollectionButton } from 'features/Recipe/add-to-collection'
import { FullRecipe } from 'entities/Recipe/model/recipe.ts'
import { useQueryClient } from '@tanstack/vue-query'
import { ShareRecipe } from 'features/Recipe/share'

const route = useRoute()

const recipeId = computed(() => {
	return Number(route.params.id as string)
})

const addRecipeToCollectionFlowRef = ref<InstanceType<typeof AddRecipeToCollectionFlow>>()

const onStartAddRecipeToCollectionFlow = (recipe: FullRecipe) => {
	console.log('babs')
	addRecipeToCollectionFlowRef.value?.start(recipe)
}

const queryClient = useQueryClient()

const onRecipeSuccessfullyAddedToCollection = async (data: { collectionId: number; recipeId: number }) => {
	await Promise.all([
		await queryClient.invalidateQueries({
			queryKey: ['recipes/my']
		}),
		await queryClient.invalidateQueries({
			queryKey: ['recipes/favourite'],
		}),
		await queryClient.invalidateQueries({
			queryKey: ['recipe/details', data.recipeId]
		})
	])
}

const onRecipeSuccessfullyToggledFavourite = async (data: { recipeId: number, isFavorited: boolean }) => {
	await Promise.all([
		await queryClient.invalidateQueries({
			queryKey: ['recipes/my']
		}),
		await queryClient.invalidateQueries({
			queryKey: ['recipes/favourite'],
		}),
		await queryClient.invalidateQueries({
			queryKey: ['recipe/details', data.recipeId]
		})
	])
}
</script>

<style scoped></style>
