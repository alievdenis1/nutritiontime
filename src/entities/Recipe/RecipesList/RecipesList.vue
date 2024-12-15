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
						{{ recipe.rating.toFixed(1) }}
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
							<span>{{ recipe.time }}</span>
						</div>
						<div
							class="flex justify-center items-center	 gap-[5px] text-gray-500 text-sm px-[8px] py-[5px] rounded-[20px] bg-[#1C1C1C0D]"
						>
							<IconFire />
							<span>
								{{ recipe.nutritionInfo.calories }}
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
							:src="recipe.author.image"
							:alt="recipe.author.name"
						>
							<template #error>
								<el-icon>
									<el-icon-user />
								</el-icon>
							</template>
						</el-image>
						{{ recipe.author.name }}
					</div>
					<button
						class="flex justify-center items-center gap-[4px] text-[#535353] cursor-pointer"
						@click="router.push(`/all-comment/${recipe.id}`)"
					>
						<IconComment />
						{{ recipe.commentsCount }}
					</button>
				</div>
				<div class="flex items-center justify-between gap-[16px]">
					<IconFavorites
						:is-liked="!!recipe.collection_ids?.length"
						active-color="#319A6E"
						:disabled="!!isChangingCollection.get(recipe.id)"
					/>
					<div @click="toggleLike(recipe.id)">
						<div class="flex justify-center items-center gap-[8px] text-[#535353]">
							<IconHeart
								:is-liked="recipe.favourited"
								icon-color="#319A6E"
								:disabled="!!isFavouriting.get(recipe.id)"
								@toggle="toggleFavorite(recipe.id)"
							/>
							<p :class="{ 'text-green': recipe.favourited }">
								{{ recipe.likes }}
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
import { ref } from 'vue'
import { IconComment, IconFavorites, IconFire, IconHeart, IconTime } from 'shared/components/Icon'
import { RecipesItem } from './type'
import { useRouter } from 'vue-router'
import { useSearchStore } from '../Search/store/search-store'
import CreateCollection from '../Search/modal/CreateCollection.vue'

const store = useSearchStore()
const router = useRouter()

const isFavouriting = ref(new Map<number, boolean>())
const isChangingCollection = ref(new Map<number, boolean>())

// const emit = defineEmits<{
//  toggleFavourite: [recipeId: number],
//  toggle
// }>()

interface Props {
	recipesData: RecipesItem[]
}

// const isFavourited = (recipe: RecipesItem) => {
//  return recipe.favourited
// }
//
// const isLiked = (recipe: RecipesItem) => {
//  return
// }

const props = withDefaults(defineProps<Props>(), {
	recipesData: () => []
})

const toggleLike = async (recipeId: number) => {
 //
}

const toggleFavorite = async (recipeId: number) => {
//
}

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
