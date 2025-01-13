<template>
	<div class="pt-[20px]">
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
					v-model="model.calories"
					name="calories"
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
					v-model="model.proteins"
					name="proteins"
					type="number"
					class="mb-2"
					background="gray"
					:title="t('proteinPlaceholder')"
				/>
			</div>

			<div class="mb-2 relative">
				<span class="absolute text-[12px] top-[6px] left-[12px] text-gray">
					{{ t('fatPer100gPlaceholder') }}
				</span>

				<VInput
					v-model="model.fats"
					name="fats"
					type="number"
					class="mb-2"
					background="gray"
					:title="t('fatPlaceholder')"
				/>
			</div>

			<div class="relative">
				<span class="absolute text-[12px] top-[6px] left-[12px] text-gray">
					{{ t('carbohydratesPer100gPlaceholder') }}
				</span>

				<VInput
					v-model="model.carbohydrates"
					name="carbohydrates"
					type="number"
					background="gray"
					:title="t('carbohydratesPlaceholder')"
				/>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { watch, computed } from 'vue'
import { useTranslation } from '@/shared/lib/i18n'
import { VInput } from '@/shared/components/Input'
import localization from './NutritionalValue.localization.json'
import { useBaseRecipeManageContext } from 'features/Recipe/manage/model/use-manage-recipe-context.ts'
import { calculateCalories } from 'entities/Recipe/model/calories/calculate-calories.ts'

const { t } = useTranslation(localization)

const { model } = useBaseRecipeManageContext()

const totalCalories = computed(() => {
	return calculateCalories({
		proteins: model.proteins ?? 0,
		fats: model.fats ?? 0,
		carbohydrates: model.carbohydrates ?? 0
	})
})

watch(totalCalories, (calories) => {
	model.calories = calories
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
