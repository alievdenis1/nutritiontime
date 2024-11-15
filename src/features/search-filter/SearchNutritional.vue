<template>
	<VAccordion :title="t('nutritionalValue')">
		<div class="mt-4 space-y-6">
			<div
				v-for="(nutrient, key) in nutrients"
				:key="key"
			>
				<h3 class="text-darkGray text-sm font-medium mb-[12px]">
					{{ t(nutrient.title) }}
				</h3>
				<div class="flex gap-4 mb-[12px]">
					<div class="flex-1 relative">
						<span class="absolute top-[6px] left-[12px] text-xs text-gray">
							{{ t('from') }}
						</span>
						<input
							v-model="nutrient.start"
							type="number"
							:min="nutrient.min"
							:max="nutrient.end"
							:step="nutrient.step"
							class="w-full h-[56px] pt-[26px] pb-[10px] pl-[12px] border rounded-md"
							@input="updateValue(key, 'start')"
						>
						<span
							class="absolute unit-position"
							:style="getNutritientStyle(nutrient.start)"
						>
							{{ nutrient.unit }}
						</span>
					</div>
					<div class="flex-1 relative">
						<span class="absolute top-[6px] left-[12px] text-xs text-gray">
							{{ t('to') }}
						</span>
						<input
							v-model="nutrient.end"
							type="text"
							:min="nutrient.start"
							:max="nutrient.max"
							:step="nutrient.step"
							class="w-full h-[56px] pt-[26px] pb-[10px] pl-[12px] border  rounded-md"
							@input="updateValue(key, 'end')"
						>
						<span
							class="absolute unit-position"
							:style="getNutritientStyle(nutrient.end)"
						>
							{{ nutrient.unit }}
						</span>
					</div>
				</div>
				<VSlider
					v-model="nutrient.value"
					:min="nutrient.min"
					:max="nutrient.max"
					:step="nutrient.step"
					class="h-[28px]"
				/>
			</div>
		</div>
	</VAccordion>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue'
import { VAccordion } from '@/shared/components/Accordion'
import { VSlider } from '@/shared/components/ui/slider'
import { useTranslation } from '@/shared/lib/i18n'
import localization from './SearchFilter.localization.json'

const { t } = useTranslation(localization)

interface Nutrient {
    title: string;
    min: number;
    max: number;
    step: number;
    start: number;
    end: number;
    value: [number, number];
    unit: string;
}

const nutrients = reactive<Record<string, Nutrient>>({
    calories: {
        title: 'caloriesPer100g',
        min: 10,
        max: 1250,
        step: 10,
        start: 10,
        end: 1250,
        value: [10, 1250],
        unit: t('caloriesUnit')
    },
    protein: {
        title: 'proteinPer100g',
        min: 1,
        max: 24,
        step: 1,
        start: 1,
        end: 24,
        value: [1, 24],
        unit: t('gramUnit')
    },
    fat: {
        title: 'fatPer100g',
        min: 1,
        max: 24,
        step: 1,
        start: 1,
        end: 24,
        value: [1, 24],
        unit: t('gramUnit')
    },
    carbs: {
        title: 'carbsPer100g',
        min: 1,
        max: 24,
        step: 1,
        start: 1,
        end: 24,
        value: [1, 24],
        unit: t('gramUnit')
    }
})

const getNutritientStyle = (nutrientValue: number) => {
    const nutrientBlockPaddingLeft = 13
    let marginLeft = Number(String(nutrientValue).length) * 11

    if (marginLeft > 40) {
        marginLeft = marginLeft - 3
    }

    return {
        left: `${marginLeft + nutrientBlockPaddingLeft}px`
    }
}

const updateValue = (nutrientKey: string, type: 'start' | 'end') => {
    const nutrient = nutrients[nutrientKey]
    if (type === 'start') {
        nutrient.start = Math.max(nutrient.min, Math.min(nutrient.start, nutrient.end))
        nutrient.value[0] = nutrient.start
    } else {
        nutrient.end = Math.max(nutrient.start, Math.min(nutrient.end, nutrient.max))
        nutrient.value[1] = nutrient.end
    }
}

Object.keys(nutrients).forEach(key => {
    watch(() => nutrients[key].value, (newValue) => {
        nutrients[key].start = newValue[0]
        nutrients[key].end = newValue[1]
    })
})
</script>

<style scoped>
.border{
    border: 1px solid #319A6E33;
}

.unit-position {
    bottom: 7px;
    left: 50px;
}
</style>