<template>
	<div class="pt-[20px]">
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
							max="59"
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
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useTranslation } from '@/shared/lib/i18n'
import localization from './CookingTime.localization.json'
import { useBaseRecipeCreationContext } from '../../../../model/base/use-base-recipe-creation-context.ts'

const { t } = useTranslation(localization)

const {
	model
} = useBaseRecipeCreationContext()

const cookingHours = ref<number>(0)
const cookingMinutes = ref<number>(0)

const readyHours = ref<number>(0)
const readyMinutes = ref<number>(0)

const formattedCookingTimeInMinutes = computed(() => {
	return cookingHours.value * 60 + cookingMinutes.value
})

const formattedReadyTimeInMinutes = computed(() => {
	return readyHours.value * 60 + readyMinutes.value
})

/** TODO: Проверить что подставлено именно то, что нужно */
watch(formattedCookingTimeInMinutes, (minutes) => {
	model.cooking_time = minutes
})

/** TODO: Проверить что подставлено именно то, что нужно */
watch(formattedReadyTimeInMinutes, (minutes) => {
	model.time_in_kitchen = minutes
})

// const formatIntoMinutes = (hours: number, minutes: number) => {
// 	return `${String(hours * 60 + minutes)} ${t('minutesFull')}`
// }

const truncateCookingTime = (event: Event) => {
	const target = (<HTMLInputElement>event.target)

	if (target?.value === '000') {
		target.value = '0'
	}
	cookingHours.value = truncateTime(cookingHours.value)
	cookingMinutes.value = truncateTime(rangeMinutes(cookingMinutes.value))
}

const truncateReadyTime = (event: Event) => {
	const target = (<HTMLInputElement>event.target)

	if(target?.value === '000') {
		target.value = '0'
	}

	readyHours.value = truncateTime(readyHours.value)
	readyMinutes.value = truncateTime(rangeMinutes(readyMinutes.value))
}

function rangeMinutes(minutes: number) {
	return Math.min(59, Math.max(0, minutes))
}

const truncateTime = (value: number) => {
	return Number(String(value).substring(0, 2))
}
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
