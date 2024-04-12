<template>
	<div class="flex items-center justify-between gap-[10px] mb-4 h-[41px]">
		<div>
			<h2 class="font-bold text-[20px] leading-[19px] text-[#735F2B]">
				{{ t('todayPlan') }}
			</h2>
			<span class="text-[15px] text-[#735F2B] font-medium opacity-70">
				{{ t('breakfast') }}
			</span>
		</div>
		<v-button class="cursor-pointer mr-[14px]">
			<img
				width="17"
				src="/image/icons/icon-pen.svg"
				height="17"

			>
		</v-button>
	</div>
	<div
		v-for="card in recipes"
		:key="card.id"
		class="bg-white w-full py-[14px] px-[20px] flex items-center justify-between mb-4 rounded-[40px]"
	>
		<div class="flex gap-3">
			<img
				width="82"
				:src="card.img"
				height="90"
				alt="recipe_picture"
			>
			<div class="flex flex-col justify-between">
				<div class="flex flex-col gap-[5px] mt-[22px] font-medium text-[#735F2B]">
					<span class="text-[15px] w leading-[95%]">
						{{ card.title }}
					</span>
					<span class="text-[10px] opacity-70">
						{{ card.desc }}
					</span>
				</div>
				<div class="flex gap-3 text-[#735F2B] items-center font-medium">
					<span class="flex items-center text-[10px] gap-1">
						<img
							width="16"
							src="/image/icons/icon-clock.svg"
							height="16"
						>
						{{ `${card.time}min.` }}
					</span>
					<span class="flex items-center text-[10px] gap-1">
						<img
							width="11"
							src="/image/icons/icon-fire.svg"
							height="15"
						>
						{{ `${card.kkal} kkal.` }}
					</span>
				</div>
			</div>
		</div>
		<v-button class="cursor-pointer">
			<el-icon
				size="8"
				class="items-center"
			>
				<el-icon-arrow-right-bold class="text-[#735F2B]" />
			</el-icon>
		</v-button>
	</div>
</template>

<script setup lang="ts">
import Localization from './RecipesList.localization.json'
import { useTranslation } from '@/shared/lib/i18n'

const { t } = useTranslation(Localization)

const recipes = [
    { id: 1, title: 'Soup with cats', desc: 'text', img:'', time: 30, kkal: 150 },
    { id: 2, title: 'Soup with cats', desc: 'text', img:'', time: 30, kkal: 150 },
    { id: 3, title: 'Soup with cats', desc: 'text', img:'', time: 30, kkal: 150 }
]
</script>

<style lang="scss" scoped></style>