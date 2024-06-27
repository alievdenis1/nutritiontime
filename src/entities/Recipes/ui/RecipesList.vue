<template>
	<div
		v-if="recipesData && recipesData.length > 0"
		class="mb-[80px] mt-[24px]"
	>
		<div
			v-for="recipe in recipesData"
			:key="recipe.id"
			class="max-w-md mx-auto rounded-[20px] overflow-hidden md:max-w-2xl mb-4"
		>
			<div class="flex  border-custom">
				<div class="relative">
					<img
						class="h-[140px] w-[140px] object-cover rounded-[20px]"
						:src="recipe.image"
						alt="recipe image"
					>
					<div
						class="absolute top-[8px] left-[8px] py-[6px] px-[6px] text-white bg-forestGreen rounded-[100px]"
					>
						{{ recipe.rating }}
					</div>
				</div>

				<div class="p-4 flex flex-col justify-between">
					<div>
						<h2 class="text-lg font-regular text-sm">
							{{ recipe.title }}
						</h2>
					</div>
					<div class="flex justify-between items-center mt-2">
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
								{{ recipe.calories }}
							</span>
						</div>
					</div>
				</div>
			</div>
			<div class="flex items-center justify-between  mt-4">
				<div class="flex justify-center items-center">
					<div class="flex justify-center items-center gap-[8px] mr-[20px]">
						<img
							class="h-[20px] w-[20px]"
							:src="recipe.author.profile_image"
							alt="author image"
						>
						{{ recipe.author.name }}
					</div>
					<p class="flex justify-center items-center gap-[4px]">
						<IconComment />
						{{ recipe.comments }}
					</p>
				</div>
				<div class="flex justify-center items-center gap-[4px] ">
					<IconHeart />
					<IconFavorites />
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { IconComment, IconFavorites, IconFire, IconHeart, IconTime } from '@/shared/components/Icon'
import { RecipeItem } from '../../Plan/ui/type'

withDefaults(defineProps<{
	recipesData: Array<RecipeItem>
}>(), {
	recipesData: () => []
})
</script>

<style scoped>
.border-custom {
	border: 1px solid #1C1C1C0D;
	border-radius: 20px;
}
</style>