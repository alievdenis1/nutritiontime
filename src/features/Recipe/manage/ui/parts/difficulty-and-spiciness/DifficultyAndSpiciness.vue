<template>
	<div class="flex flex-col gap-6 pt-[20px]">
		<div class="gradation-group flex flex-col gap-[12px]">
			<h3 class="text-sm font-semibold text-darkGray">
				{{ t('spiciness') }}
			</h3>

			<div class="gradation-buttons flex gap-[8px]">
				<button
					v-for="level in levels"
					:key="level"
					:class="[
						'w-10 h-10 flex items-center justify-center rounded-full border',
						{
							'bg-forestGreen text-white': level === model.spiciness,
							'bg-lightGray': level !== model.spiciness
						}
					]"
					@click="selectSpiciness(level)"
				>
					{{ level }}
				</button>
			</div>

			<p class="text-gray text-[12px]">
				{{ selectedSpicinessTitle }}
			</p>
		</div>

		<div class="gradation-group flex flex-col gap-[12px]">
			<h3 class="text-sm font-semibold text-darkGray">
				{{ t('difficulty') }}
			</h3>

			<div class="gradation-buttons flex gap-[8px]">
				<button
					v-for="level in levels"
					:key="level"
					:class="[
						'w-10 h-10 flex items-center justify-center rounded-full border',
						{
							'bg-forestGreen text-white': level === model.difficulty,
							'bg-lightGray': level !== model.difficulty
						}
					]"
					@click="selectDifficulty(level)"
				>
					{{ level }}
				</button>
			</div>

			<p class="text-gray text-[12px]">
				{{ selectedDifficultyTitle }}
			</p>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useTranslation } from '@/shared/lib/i18n'
import localization from './DifficultyAndSpiciness.localization.json'
import { useBaseRecipeManageContext } from 'features/Recipe/manage/model/use-manage-recipe-context.ts'

const { t } = useTranslation(localization)

const levels: number[] = [1, 2, 3, 4, 5] as const

const {
	model,
} = useBaseRecipeManageContext()

const SpicinessTitles: Record<number, string> = {
	1: t('spiciness-1'),
	2: t('spiciness-2'),
	3: t('spiciness-3'),
	4: t('spiciness-4'),
	5: t('spiciness-5')
}

const DifficultyTitles: Record<number, string> = {
	1: t('difficulty-1'),
	2: t('difficulty-2'),
	3: t('difficulty-3'),
	4: t('difficulty-4'),
	5: t('difficulty-5')
}

const selectedSpicinessTitle = computed(() => {
	return SpicinessTitles[model.spiciness]
})

const selectedDifficultyTitle = computed(() => {
	return DifficultyTitles[model.difficulty]
})

const selectSpiciness = (level: number) => {
	model.spiciness = level
}

const selectDifficulty = (level: number) => {
	model.difficulty = level
}
</script>

<style scoped>
.gradation-buttons button {
	width: 62px;
	height: 32px;
}
</style>
