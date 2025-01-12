<template>
	<div
		v-for="recipe in recipes"
		:key="recipe.id"
		class="recipe-card"
	>
		<div class="recipe-card-inner">
			<div class="flex items-center mb-[12px]">
				<el-image
					class="w-8 h-8 rounded-full mr-2"
					:src="normalizeImageUrl(recipe.author?.image ?? '')"
					:alt="recipe.author?.name"
				>
					<template #error>
						<div class="h-full w-full flex justify-center items-center bg-[#1C1C1C0D]">
							<el-icon>
								<el-icon-user />
							</el-icon>
						</div>
					</template>
				</el-image>
				<span class="text-sm text-gray-600">{{ recipe.author?.name }}</span>
			</div>
			<div
				class="relative"
				@click="router.push(`/recipe/${recipe.id}`)"
			>
				<ElImage
					class="w-full h-[343px] object-cover rounded-[12px]"
					:src="normalizeImageUrl(recipe.image ?? '')"
					:alt="recipe.title"
				>
					<template #error>
						<div class="h-full w-full flex justify-center items-center bg-[#1C1C1C0D]">
							<el-icon>
								<el-icon-picture />
							</el-icon>
						</div>
					</template>
				</ElImage>

				<div
					class="absolute top-2 left-2 bg-forestGreen text-white rounded-full w-[32px] h-[32px] flex items-center justify-center text-sm font-bold"
				>
					{{ recipe.average_rating?.toFixed(1) }}
				</div>
			</div>

			<div class="flex items-center text-sm text-gray-600 mb-4 mt-[12px]">
				<div class="flex items-center bg-lightGray px-[9px] py-[5px] rounded-[12px] mr-[8px]">
					<IconTime class="mr-1" />
					<span>{{ recipe.cooking_time }} {{ t('min') }}</span>
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
				class="flex gap-2 justify-end items-center text-slateGray"
				@click.stop
			>
				<AddRecipeToCollectionButton
					:recipe="recipe"
					@click="onStartAddRecipeToCollectionFlow(recipe)"
				/>

				<ToggleFavoriteButton
					:model-value="recipe.is_favorited"
					:recipe-id="recipe.id"
					:likes="recipe.likes_count"
					@success="onRecipeSuccessfullyToggledFavourite"
				/>
			</div>
		</div>
	</div>

	<AddRecipeToCollectionFlow
		ref="addRecipeToCollectionFlowRef"
		@success="onRecipeCollectionChangeSuccess"
	/>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { IconFire, IconTime } from 'shared/components/Icon'
import type { RecipeItem } from '../RecipesList/type'
import { useTranslation } from 'shared/lib/i18n'
import localization from './SearchBar.localization.json'
import { useSearchStore } from './store/search-store'
import { ElImage } from 'element-plus'
import { Picture as ElIconPicture, User as ElIconUser } from '@element-plus/icons-vue'
import AddRecipeToCollectionButton from 'features/Recipe/add-to-collection/ui/AddRecipeToCollectionButton.vue'
import { ToggleFavoriteButton } from 'features/Recipe/toggle-favourite'
import AddRecipeToCollectionFlow from 'features/Recipe/add-to-collection/ui/AddRecipeToCollectionFlow.vue'
import { useQueryClient } from '@tanstack/vue-query'
import { normalizeImageUrl } from 'shared/lib/mapping/normalize-image-url.ts'

const router = useRouter()
const { t } = useTranslation(localization)
const store = useSearchStore()

const queryClient = useQueryClient()

const props = defineProps<{
	recipes: RecipeItem[]
}>()

const addRecipeToCollectionFlowRef = ref<InstanceType<typeof AddRecipeToCollectionFlow>>()

function onStartAddRecipeToCollectionFlow(recipe: RecipeItem) {
	addRecipeToCollectionFlowRef.value?.start(recipe)
}

async function onRecipeCollectionChangeSuccess(data: { recipeId: number, collectionId: number }) {
	store.addCollectionToRecipe(data.recipeId, data.collectionId)

	await Promise.all([
		await queryClient.invalidateQueries({
			queryKey: ['recipes/my']
		}),
		await queryClient.invalidateQueries({
			queryKey: ['recipes/favourite'],
		}),
	])
}

async function onRecipeSuccessfullyToggledFavourite(data: { recipeId: number, isFavorited: boolean}) {
	console.log(data)
	store.addRecipeToFavourite(data.recipeId, data.isFavorited ? 'add' : 'remove')

	await Promise.all([
		await queryClient.invalidateQueries({
			queryKey: ['recipes/my'],
		}),
		await queryClient.invalidateQueries({
			queryKey: ['recipes/favourite']
		}),
	])
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
