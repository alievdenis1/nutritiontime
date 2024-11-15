<template>
	<div>
		<VAccordion :title="t('timeRecipeTitle')">
			<div class="mt-[20px]">
				<div class="flex flex-col gap-4">
					<div class="relative">
						<span
							class="text-[12px] top-[6px] left-[12px] text-gray"
						>
							{{ t('kitchenTimePlaceholder') }}
						</span>
						<div class="flex gap-2 items-center">
							<div class="flex items-center border p-2 rounded text-base h-[54px]">
								<input
									v-model="cookingHours"
									type="number"
									placeholder="00"
									class="text-center max-w-8"
									@change="setCurrentRecipeTime('cooking')"
									@input="truncateCookingTime"
								>
								<span class="text-[#535353] text-xs">{{ t('hour') }}</span>
							</div>
							<span>:</span>
							<div class="flex items-center border p-2 rounded text-base h-[54px]">
								<input
									v-model="cookingMinutes"
									type="number"
									placeholder="00"
									class="text-center max-w-8"
									@change="setCurrentRecipeTime('cooking')"
									@input="truncateCookingTime"
								>
								<span class="text-[#535353] text-xs">{{ t('minute') }}</span>
							</div>
						</div>
						<p class="text-xs text-gray mt-1">
							{{ t('kitchenTimeDescription') }}
						</p>
					</div>
					<div class="relative">
						<span
							class="text-[12px] top-[6px] left-[12px] text-gray"
						>
							{{ t('cookingTimePlaceholder') }}
						</span>
						<div class="flex gap-2 items-center">
							<div class="flex items-center border p-2 rounded text-base h-[54px]">
								<input
									v-model="readyHours"
									type="number"
									placeholder="00"
									class="text-center max-w-8"
									@change="setCurrentRecipeTime('ready')"
									@input="truncateReadyTime"
								>
								<span class="text-[#535353] text-xs">{{ t('hour') }}</span>
							</div>
							<span>:</span>
							<div class="flex items-center border p-2 rounded text-base h-[54px]">
								<input
									v-model="readyMinutes"
									type="number"
									placeholder="00"
									class="text-center max-w-8"
									@change="setCurrentRecipeTime('ready')"
									@input="truncateReadyTime"
								>
								<span class="text-[#535353] text-xs">{{ t('minute') }}</span>
							</div>
						</div>
						<p class="text-xs text-gray mt-1">
							{{ t('cookingTimeDescription') }}
						</p>
					</div>
				</div>
			</div>
		</VAccordion>
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { VAccordion } from '@/shared/components/Accordion'
import { useTranslation } from '@/shared/lib/i18n'
import localization from './CreateRecipeTime.localization.json'
import { useRecipeStore } from '../../../DetailedCardRecipe/stores/recipeStore'
import { useRoute } from 'vue-router'

const { t } = useTranslation(localization)
const store = useRecipeStore()
const route = useRoute()

const cookingHours = ref<number>(0)
const cookingMinutes = ref<number>(0)

const readyHours = ref<number>(0)
const readyMinutes = ref<number>(0)

const setCurrentRecipeTime = (type: 'cooking' | 'ready') => {
	if (store.currentRecipe) {
		if (type === 'cooking') {
			const time = formatIntoMinutes(cookingHours.value, cookingMinutes.value)

			store.currentRecipe.recipeInfo['Время на кухне'] = time
		} else {
			const time = formatIntoMinutes(readyHours.value, readyMinutes.value)

			store.currentRecipe.recipeInfo['Будет готово через'] = time
		}
	}
}

const formatIntoMinutes = (hours: number, minutes: number) => {
	return `${String(hours * 60 + minutes)} ${t('minutesFull')}`
}

const truncateCookingTime = (event: Event) => {
	const target = (<HTMLInputElement>event.target)

	if(target?.value === '000') {
		target.value = '0'
	}
	cookingHours.value = truncateTime(cookingHours.value)
	cookingMinutes.value = truncateTime(cookingMinutes.value)
}

const truncateReadyTime = (event: Event) => {
	const target = (<HTMLInputElement>event.target)

	if(target?.value === '000') {
		target.value = '0'
	}

	readyHours.value = truncateTime(readyHours.value)
	readyMinutes.value = truncateTime(readyMinutes.value)
}

const truncateTime = (value: number) => {
	return Number(String(value).substring(0, 2))
}

const setKitchenAndCookingTime = (recipeInfo: Record<string, string>) => {
	const kitchenTimeValue = recipeInfo['Время на кухне'] || '0'
	const cookingTimeValue = recipeInfo['Будет готово через'] || '0'

	const formatTimeValue = (value: string) => {
		const minutes = parseInt(value)

		return {
			hours: Math.floor(minutes / 60),
			minutes: minutes % 60,
		}
	}

	cookingHours.value = formatTimeValue(kitchenTimeValue).hours
	cookingMinutes.value = formatTimeValue(kitchenTimeValue).minutes

	readyHours.value = formatTimeValue(cookingTimeValue).hours
	readyMinutes.value = formatTimeValue(cookingTimeValue).minutes
}

onMounted(() => {
	const recipeId = route.params.id as string
	const currentRecipe = store.recipes.find(recipe => recipe.id === recipeId)
	if (currentRecipe && currentRecipe.recipeInfo) {
		setKitchenAndCookingTime(currentRecipe.recipeInfo)
	}
})

// Следим за изменениями в currentRecipe
watch(() => store.currentRecipe, (newRecipe) => {
	if (newRecipe && newRecipe.recipeInfo) {
		setKitchenAndCookingTime(newRecipe.recipeInfo)
	}
}, { deep: true })
</script>

<style scoped>
.border {
	border: 1px solid #E1E1E1;
}

.padding-filled {
	padding: 26px 12px 10px;
}

.padding-empty {
	padding: 16px 8px;
}

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
}

.kitchen-hours::after {
	content: ':';
	position: absolute;
}
</style>