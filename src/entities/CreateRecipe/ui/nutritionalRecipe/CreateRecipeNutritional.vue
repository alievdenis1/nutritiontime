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
					<input
						v-model="calories"
						type="text"
						:placeholder="t('caloriesPer100gPlaceholder')"
						class="border rounded px-[12px] pt-[22px] pb-[12px] text-base w-full mb-4 bg-lightGray"
						readonly
					>
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
					<input
						v-model="protein"
						type="text"
						:placeholder="t('proteinPer100gPlaceholder')"
						class="border rounded px-[12px] pt-[22px] pb-[10	px] text-base w-full mb-2 bg-lightGray text-[14px]"
						readonly
					>
				</div>
				<div class="mb-2 relative">
					<span class="absolute text-[12px] top-[6px] left-[12px] text-gray">
						{{ t('fatPer100gPlaceholder') }}
					</span>
					<input
						v-model="fat"
						type="text"
						:placeholder="t('fatPer100gPlaceholder')"
						class="border rounded px-[12px] pt-[22px] pb-[10px] text-base w-full mb-2 bg-lightGray text-[14px]"
						readonly
					>
				</div>
				<div class="relative">
					<span class="absolute text-[12px] top-[6px] left-[12px] text-gray">
						{{ t('carbohydratesPer100gPlaceholder') }}
					</span>
					<input
						v-model="carbohydrates"
						type="text"
						:placeholder="t('carbohydratesPer100gPlaceholder')"
						class="border rounded px-[12px] pt-[22px] pb-[10px] text-base w-full bg-lightGray text-[14px]"
						readonly
					>
				</div>
			</div>
		</div>
	</VAccordion>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useTranslation } from '@/shared/lib/i18n'
import { VAccordion } from '@/shared/components/Accordion'
import localization from './CreateRecipeNutritional.localization.json'

const { t } = useTranslation(localization)

const calories = ref('340')
const protein = ref('24')
const fat = ref('34')
const carbohydrates = ref('105')
</script>

<style scoped>
.border {
    border: 1px solid #E1E1E1;
}

.bg-lightGray {
    background-color: #f5f5f5;
}

.text-gray {
    color: #9e9e9e;
}
</style>