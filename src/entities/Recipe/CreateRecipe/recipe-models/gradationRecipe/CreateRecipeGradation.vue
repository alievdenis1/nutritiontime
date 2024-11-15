<template>
	<div>
		<VAccordion :title="t('spicinessAndDifficulty')">
			<div class="flex flex-col gap-6 mt-[20px]">
				<div class="gradation-group flex flex-col gap-[12px]">
					<h3 class="text-sm font-semibold text-darkGray">
						{{ t('spiciness') }}
					</h3>
					<div class="gradation-buttons flex gap-[8px]">
						<button
							v-for="level in levels"
							:key="level"
							:class="['w-10 h-10 flex items-center justify-center rounded-full border', level === spiciness ? 'bg-forestGreen text-white' : 'bg-lightGray']"
							@click="selectSpiciness(level)"
						>
							{{ level }}
						</button>
					</div>
					<p class="text-gray text-[12px]">
						{{ selectedSpiciness }}
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
							:class="['w-10 h-10 flex items-center justify-center rounded-full border', level === difficulty ? 'bg-forestGreen text-white' : 'bg-lightGray']"
							@click="selectDifficulty(level)"
						>
							{{ level }}
						</button>
					</div>
					<p class="text-gray text-[12px]">
						{{ selectedDifficulty }}
					</p>
				</div>
			</div>
		</VAccordion>
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { VAccordion } from '@/shared/components/Accordion'
import { useTranslation } from '@/shared/lib/i18n'
import localization from './CreateRecipeGradation.localization.json'
import { useRecipeStore } from '../../../DetailedCardRecipe/stores/recipeStore'
import { useRoute } from 'vue-router'

const { t } = useTranslation(localization)
const store = useRecipeStore()
const route = useRoute()

const spiciness = ref(3)
const difficulty = ref(3)
const levels = [1, 2, 3, 4, 5]

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

const selectedSpiciness = computed(() => {
	return SpicinessTitles[spiciness.value]
})
const selectedDifficulty = computed(() => {
	return DifficultyTitles[difficulty.value]
})

const selectSpiciness = (level: number) => {
	spiciness.value = level
	store.setRecipeInfoField('Уровень остроты', String(level))
}

const selectDifficulty = (level: number) => {
	difficulty.value = level
	store.setRecipeInfoField('Уровень сложности', String(level))
}

const setSpicinessAndDifficulty = (recipeInfo: Record<string, string>) => {
	const spicinessLevel = recipeInfo['Уровень остроты']
	const difficultyLevel = recipeInfo['Уровень сложности']
	if (spicinessLevel) {
		spiciness.value = parseInt(spicinessLevel.split(' ')[0], 10)
	}
	if (difficultyLevel) {
		difficulty.value = parseInt(difficultyLevel.split(' ')[0], 10)
	}
}

onMounted(() => {
	const recipeId = route.params.id as string
	const currentRecipe = store.recipes.find(recipe => recipe.id === recipeId)
	if (currentRecipe && currentRecipe.recipeInfo) {
		setSpicinessAndDifficulty(currentRecipe.recipeInfo)
	}
})
</script>

<style scoped>
.gradation-buttons button {
	width: 62px;
	height: 32px;
}
</style>