<template>
	<div
		v-for="recipe in recipes"
		:key="recipe.id"
		class="recipe-card"
	>
		<div class="recipe-card-inner">
			<div class="flex items-center mb-[12px]">
				<img
					class="w-8 h-8 rounded-full mr-2"
					:src="recipe.author.image"
					:alt="recipe.author.name"
				>
				<span class="text-sm text-gray-600">{{ recipe.author.name }}</span>
			</div>
			<div
				class="relative"
				@click="router.push(`/recipe/${recipe.id}`)"
			>
				<img
					class="w-full h-[343px] object-cover rounded-[12px]"
					:src="recipe.image"
					:alt="recipe.title"
				>
				<div
					class="absolute top-2 left-2 bg-forestGreen text-white rounded-full w-[32px] h-[32px] flex items-center justify-center text-sm font-bold"
				>
					{{ recipe.rating.toFixed(1) }}
				</div>
			</div>

			<div class="flex items-center text-sm text-gray-600 mb-4 mt-[12px]">
				<div class="flex items-center bg-lightGray px-[9px] py-[5px] rounded-[12px] mr-[8px]">
					<IconTime class="mr-1" />
					<span>{{ recipe.cookingTime }} {{ t('min') }}</span>
				</div>
				<div class="flex items-center bg-lightGray px-[9px] py-[5px] rounded-[12px]">
					<IconFire class="mr-1" />
					<span>{{ recipe.calories }} {{ t('kcal') }}</span>
				</div>
			</div>
			<h2 class="text-sm text-darkGray mb-[8px]">
				{{ recipe.title }}
			</h2>

			<div
				class="flex justify-between items-center text-slateGray"
				@click.stop
			>
				<div class="flex items-center">
					<IconComment class="mr-1" />
					<span>{{ recipe.commentsCount }}</span>
				</div>
				<div class="flex items-center">
					<IconFavorites
						:is-liked="favoritesState[recipe.id]"
						class="mr-[12px]"
						@toggle="toggleFavorite(recipe.id)"
					/>
					<div
						class="flex items-center"
						@click="toggleLike(recipe.id)"
					>
						<IconHeart
							:is-liked="likesState[recipe.id]"
							class="mr-1"
						/>
						<span>{{ recipe.likesCount }}</span>
					</div>
				</div>
			</div>
			<CreateCollection />
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { IconComment, IconFire, IconHeart, IconTime, IconFavorites } from 'shared/components/Icon'
import type { RecipesItem } from '../RecipesList/type'
import CreateCollection from '../Search/modal/CreateCollection.vue'
import { useTranslation } from 'shared/lib/i18n'
import localization from './SearchBar.localization.json'
import { useSearchStore } from './store/search-store'

const router = useRouter()
const { t } = useTranslation(localization)
const store = useSearchStore()

const props = defineProps<{
	recipes: RecipesItem[]
}>()

const favoritesState = ref<Record<number, boolean>>({})
const likesState = ref<Record<number, boolean>>({})

props.recipes.forEach(recipe => {
	favoritesState.value[recipe.id] = false
	likesState.value[recipe.id] = false
})

const toggleFavorite = (recipeId: number) => {
	store.toggleModalOpen()
	favoritesState.value[recipeId] = !favoritesState.value[recipeId]
}

const toggleLike = (recipeId: number) => {
	likesState.value[recipeId] = !likesState.value[recipeId]
}
</script>

<style scoped>
.recipe-card {
	width: 100vw;
	margin-left: calc(-50vw + 50%);
	background-color: white;
	border-top: 1px solid #1C1C1C0D;
	border-bottom: 1px solid #1C1C1C0D;
	padding: 12px 16px;
	margin-top: 24px;
	border-radius: 16px;
}

.recipe-card-inner {
	max-width: 100%;
	margin: 0 auto;
}

@media (min-width: 640px) {
	.recipe-card-inner {
		max-width: 640px;
	}
}

@media (min-width: 768px) {
	.recipe-card-inner {
		max-width: 768px;
	}
}

@media (min-width: 1024px) {
	.recipe-card-inner {
		max-width: 1024px;
	}
}
</style>