<template>
	<VAccordion :title="t('nutritionalValueTitle')">
		<div class="mt-[20px]">
			<p class="text-gray text-xs mb-4">
				{{ t('nutritionalValueDescription') }}
			</p>
			<div class="mb-4">
				<label class="block text-black text-sm font-bold mb-2">
					{{ t('caloriesPer100gTitle') }}
				</label>
				<div class="relative">
					<span class="absolute text-[12px] top-[6px] left-[12px] text-gray">
						{{ t('caloriesPer100gTitle') }}
					</span>
					<VInput
						v-model="calories"
						class="mb-4"
						background="gray"
						:title="t('caloriesPlaceholder')"
						readonly
					/>
				</div>
			</div>
			<div>
				<label class="block text-black text-sm font-bold mb-2">
					{{ t('macronutrientsPer100gTitle') }}
				</label>
				<div class="mb-2 relative">
					<span class="absolute text-[12px] top-[6px] left-[12px] text-gray">
						{{ t('proteinPer100gPlaceholder') }}
					</span>
					<VInput
						v-model="protein"
						class="mb-2"
						background="gray"
						:title="t('proteinPlaceholder')"
						readonly
					/>
				</div>
				<div class="mb-2 relative">
					<span class="absolute text-[12px] top-[6px] left-[12px] text-gray">
						{{ t('fatPer100gPlaceholder') }}
					</span>
					<VInput
						v-model="fat"
						class="mb-2"
						background="gray"
						:title="t('fatPlaceholder')"
						readonly
					/>
				</div>
				<div class="relative">
					<span class="absolute text-[12px] top-[6px] left-[12px] text-gray">
						{{ t('carbohydratesPer100gPlaceholder') }}
					</span>
					<VInput
						v-model="carbohydrates"
						background="gray"
						:title="t('carbohydratesPlaceholder')"
						readonly
					/>
				</div>
			</div>
		</div>
	</VAccordion>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useTranslation } from '@/shared/lib/i18n'
import { VAccordion } from '@/shared/components/Accordion'
import { VInput } from '@/shared/components/Input'
import localization from './CreateRecipeNutritional.localization.json'
import { useRecipeStore } from '../../../DetailedCardRecipe/stores/recipeStore'
import { useRoute } from 'vue-router'

const { t } = useTranslation(localization)
const store = useRecipeStore()
const route = useRoute()

const calories = ref('')
const protein = ref('')
const fat = ref('')
const carbohydrates = ref('')

onMounted(() => {
	const isCreateRoute = route.name === 'CreateRecipe'
	if (!isCreateRoute && store.currentRecipe && store.currentRecipe.nutritionInfo) {
		calories.value = store.currentRecipe.nutritionInfo['Калорийность на 100 г.'].split(' ')[0]
		protein.value = store.currentRecipe.nutritionInfo['Белки на 100 г.'].split(' ')[0]
		fat.value = store.currentRecipe.nutritionInfo['Жиры на 100 г.'].split(' ')[0]
		carbohydrates.value = store.currentRecipe.nutritionInfo['Углеводы на 100 г.'].split(' ')[0]
	}
})

const updateNutritionInfo = () => {
	if (store.currentRecipe) {
		store.currentRecipe.nutritionInfo = {
			'Калорийность на 100 г.': `${calories.value} ккал`,
			'Белки на 100 г.': `${protein.value} г.`,
			'Жиры на 100 г.': `${fat.value} г.`,
			'Углеводы на 100 г.': `${carbohydrates.value} г.`
		}
	}
}

watch([calories, protein, fat, carbohydrates], () => {
	updateNutritionInfo()
})
</script>

<style scoped>
.border {
	border: 1px solid #E1E1E1;
}

.bg-white {
	background-color: #ffffff;
}

.text-gray {
	color: #9e9e9e;
}
</style>