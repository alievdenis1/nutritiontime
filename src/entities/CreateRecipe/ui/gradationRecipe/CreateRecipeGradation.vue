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
							:class="['w-10 h-10 flex items-center justify-center rounded-full border', level === spiciness ? 'bg-forestGreen text-white' : 'bg-lightGray text-gray']"
							@click="selectSpiciness(level)"
						>
							{{ level }}
						</button>
					</div>
					<p class="text-gray text-[12px]">
						{{ t('spicinessDescription') }}
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
							:class="['w-10 h-10 flex items-center justify-center rounded-full border', level === difficulty ? 'bg-forestGreen text-white' : 'bg-lightGray text-gray']"
							@click="selectDifficulty(level)"
						>
							{{ level }}
						</button>
					</div>
					<p class="text-gray text-[12px]">
						{{ t('difficultyDescription') }}
					</p>
				</div>
			</div>
		</VAccordion>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { VAccordion } from '@/shared/components/Accordion'
import { useTranslation } from '@/shared/lib/i18n'
import localization from './CreateRecipeGradation.localization.json'

const { t } = useTranslation(localization)

const spiciness = ref(3)
const difficulty = ref(3)
const levels = [1, 2, 3, 4, 5]

const selectSpiciness = (level: number) => {
    spiciness.value = level
}

const selectDifficulty = (level: number) => {
    difficulty.value = level
}
</script>

<style scoped>
.gradation-buttons button {
    width: 62px;
    height: 32px;
}
</style>