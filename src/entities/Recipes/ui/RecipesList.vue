<template>
	<div class="mb-[80px]">
		<div
			v-for="recipe in recipesData"
			:key="recipe.id"
			class="max-w-md mx-auto rounded-[20px] overflow-hidden md:max-w-2xl mb-4"
		>
			<div
				v-if="recipesData.length !== 0"
				class="flex  border-custom"
			>
				<div class="relative">
					<img
						class="h-48 w-48 object-cover rounded-[20px]"
						:src="recipe.image"
						alt="recipe image"
					>
					<div
						class="absolute top-[8px] left-[8px] py-[6px] px-[6px] text-[#FFFFFF] bg-[#319A6E] rounded-[100px]"
					>
						{{ recipe.rating }}
					</div>
				</div>

				<div class="p-4 flex flex-col justify-between">
					<div>
						<h2 class="text-lg font-bold">
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
							class="h-10 w-10 rounded-full"
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
		<ContentBlock
			v-if="recipesData.length === 0"
			image="../../../../public/image/start-screen-image.webp"
			:text="t('liked')"
			:button-text="t('goodies')"
			button-class="bg-green-500 text-white"
			button-icon="green"
		/>
	</div>
</template>

<script setup lang="ts">
import { ContentBlock } from '@/shared/components/ContentBlock'
import { recipesData } from '../data/recipes.ts'
import { IconComment, IconFavorites, IconFire, IconHeart, IconTime } from '@/shared/components/Icon'
import { useTranslation } from '@/shared/lib/i18n'
import Localization from './RecipesList.localization.json'
const { t } = useTranslation(Localization)
</script>

<style scoped>
.border-custom {
	border: 1px solid #1C1C1C0D;
	border-radius: 20px;
}
</style>