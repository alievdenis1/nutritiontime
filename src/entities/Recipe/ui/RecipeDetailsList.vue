<template>
	<div class="flex flex-col items-center gap-4 text-[#735F2B] text-[15px] font-normal">
		<div class="flex flex-col items-center gap-1">
			<img
				class="rounded-[40px]"
				height="200"
				src="/image/placeholder.png"
				width="347"
				alt="Recipe image"
			>
			<span class="text-[#AB9F80] text-[10px] leading-[94.95%]">
				food name
			</span>
		</div>
		<RecipeDetail
			:title="t('aboutTheDish')"
			text="Dish"
		/>
		<RecipeDetail
			:title="t('nft')"
			text="IP: Founder:"
		/>
		<RecipeDetail
			:title="t('ingredients')"
			text="Time Tosi Bosi, text,"
		/>
		<div class="w-full">
			<div class="flex justify-between">
				<span class="opacity-70">
					{{ t('reciept') }}
				</span>
				<v-button
					class="cursor-pointer"
					@click="isDropDownOpen = !isDropDownOpen"
				>
					<img
						:class="{ 'rotate-180': isDropDownOpen}"
						height="19"
						src="/image/icons/icon-arrow-rounded.svg"
						width="19"
					>
				</v-button>
			</div>
			<div
				v-for="item in recipeSteps"
				:key="item.id"
			>
				<el-collapse-transition>
					<RecipeDetail
						v-if="isDropDownOpen || item.id === 1"
						:text="item.text"
						class="text-[#9D8C61] text-center"
					/>
				</el-collapse-transition>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import RecipeDetail from './RecipeDetail.vue'
import Localization from './RecipeDetailsList.localization.json'
import { useTranslation } from '@/shared/lib/i18n'

const { t } = useTranslation(Localization)
const isDropDownOpen = ref(false)
const recipeSteps = [
	{ id: 1, text: 'Shan first' },
	{ id: 2, text: 'Shan second' }
]
</script>

<style scoped>

</style>