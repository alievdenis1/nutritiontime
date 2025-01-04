<template>
	<div
		v-if="recipesData && recipesData.length > 0"
		class="mt-[24px]"
	>
		<div
			v-for="recipe in recipesData"
			:key="recipe.id"
			class="max-w-md mx-auto rounded-[20px] overflow-hidden md:max-w-2xl [&:not(:last-of-type)]:mb-4 px-[2px] py-[2px] cursor-pointer"
			@click="router.push(`/recipe/${recipe.id}`)"
		>
			<div class="flex bg-white border-custom h-[140px]">
				<div class="relative">
					<el-image
						class="img object-cover rounded-[20px] h-full"
						:src="recipe.image"
						alt="recipe image"
					>
						<template #error>
							<div class="h-full w-full flex justify-center items-center bg-[#1C1C1C0D]">
								<el-icon>
									<el-icon-picture />
								</el-icon>
							</div>
						</template>
					</el-image>
					<div
						class="absolute top-[8px] left-[8px] py-[6px] px-[6px] text-white bg-forestGreen rounded-[100px]"
					>
						{{ recipe.average_rating?.toFixed(1) }}
					</div>
				</div>

				<div class="p-[12px] flex flex-col justify-between">
					<div>
						<h2 class="truncated-text text-lg font-regular text-sm">
							{{ recipe.title }}
						</h2>
					</div>
					<div class="flex justify-between items-center mt-2 flex-wrap gap-[6px]">
						<div
							class="flex justify-center items-center	 gap-[5px] text-gray-500 text-sm px-[8px] py-[5px] rounded-[20px] bg-[#1C1C1C0D]"
						>
							<IconTime />
							<span>{{ recipe.cooking_time }}</span>
						</div>
						<div
							class="flex justify-center items-center	 gap-[5px] text-gray-500 text-sm px-[8px] py-[5px] rounded-[20px] bg-[#1C1C1C0D]"
						>
							<IconFire />
							<span>
								{{ recipe.calories }}
							</span>
						</div>
					</div>
				</div>
			</div>
			<div
				class="flex items-center justify-between  mt-4"
				@click.stop
			>
				<div class="flex justify-center items-center">
					<div class="flex justify-center items-center gap-[8px] mr-[20px]">
						<el-image
							class="h-[20px] w-[20px]"
							:src="recipe.author?.image"
							:alt="recipe.author?.name"
						>
							<template #error>
								<el-icon>
									<el-icon-user />
								</el-icon>
							</template>
						</el-image>
						{{ recipe.author?.name }}
					</div>
					<button
						class="flex justify-center items-center gap-[4px] text-[#535353] cursor-pointer"
						@click="router.push(`/all-comment/${recipe.id}`)"
					>
						<IconComment />
						{{ recipe.total_comments_count }}
					</button>
				</div>
				<div class="flex items-center justify-between gap-[16px]">
					<IconFavorites
						v-loading="collectionLoadingStates.has(recipe.id)"
						:is-liked="!!recipe.collection_ids?.length"
						active-color="#319A6E"
						:disabled="collectionLoadingStates.has(recipe.id)"
					/>
					<div @click="toggleLike(recipe.id)">
						<div class="flex justify-center items-center gap-[8px] text-[#535353]">
							<IconHeart
								v-loading="likeLoadingStates.has(recipe.id)"
								:is-liked="recipe.is_favorited"
								icon-color="#319A6E"
								:disabled="likeLoadingStates.has(recipe.id)"
								@toggle="toggleCollection(recipe.id)"
							/>

							<p :class="{ 'text-green': recipe.is_favorited }">
								{{ recipe.likes_count }}
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
	<CreateCollection />
</template>

<script setup lang="ts">
import { IconComment, IconFavorites, IconFire, IconHeart, IconTime } from 'shared/components/Icon'
import { RecipeItem } from './type'
import { useRouter } from 'vue-router'
import CreateCollection from '../Search/modal/CreateCollection.vue'

const router = useRouter()

// const emit = defineEmits<{
//  toggleFavourite: [recipeId: number],
//  toggle
// }>()

type LikeLoadingStates = Set<number>
type CollectionLoadingStates = Set<number>

interface Props {
	recipesData: RecipeItem[]
	likeLoadingStates: LikeLoadingStates
	collectionLoadingStates: CollectionLoadingStates
}

const emit = defineEmits<{
	toggleLike: [recipeId: number]
	toggleCollection: [recipeId: number]
}>()

const props = withDefaults(defineProps<Props>(), {
	recipesData: () => [],
	likeLoadingStates: () => new Set<number>,
	collectionLoadingStates: () => new Set<number>
})

const toggleLike = async (recipeId: number) => {
	emit('toggleLike', recipeId)
}

const toggleCollection = async (recipeId: number) => {
	emit('toggleCollection', recipeId)
}

// const toggleFavorite = async (recipeId: number) => {
// //
// }

</script>

<style scoped>
.border-custom {
	border: 1px solid #1C1C1C0D;
	border-radius: 20px;
}

.truncated-text {
	display: -webkit-box;
	-webkit-box-orient: vertical;
	-webkit-line-clamp: 2;
	overflow: hidden;
	text-overflow: ellipsis;
	line-clamp: 2;
	max-height: 3em;
	line-height: 1.5em;
}

.img {
	height: 140px;
	min-width: 140px;
	max-width: 140px;
}
</style>
