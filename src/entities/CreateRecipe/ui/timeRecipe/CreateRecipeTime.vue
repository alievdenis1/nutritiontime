<template>
	<VAccordion :title="t('timeRecipeTitle')">
		<div class="mt-[20px]">
			<div class="flex flex-col gap-4">
				<div class="relative">
					<span
						v-if="kitchenTime.length > 0"
						class="absolute text-[12px] top-[6px] left-[12px] text-gray"
					>
						{{ t('kitchenTimePlaceholder') }}
					</span>
					<input
						v-model="kitchenTime"
						type="text"
						:placeholder="t('kitchenTimePlaceholder')"
						class="border rounded text-base w-full h-[54px]"
						:class="{ 'padding-filled': kitchenTime.length > 0, 'padding-empty': kitchenTime.length === 0 }"
						@input="formatInput"
					>
					<p class="text-xs text-gray mt-1">
						{{ t('kitchenTimeDescription') }}
					</p>
				</div>
				<div class="relative">
					<span
						v-if="cookingTime.length > 0"
						class="absolute text-[12px] top-[6px] left-[12px] text-gray"
					>
						{{ t('cookingTimePlaceholder') }}
					</span>
					<input
						v-model="cookingTime"
						type="text"
						:placeholder="t('cookingTimePlaceholder')"
						class="border rounded text-base w-full h-[54px]"
						:class="{ 'padding-filled': cookingTime.length > 0, 'padding-empty': cookingTime.length === 0 }"
						@input="formatInput"
					>
					<p class="text-xs text-gray mt-1">
						{{ t('cookingTimeDescription') }}
					</p>
				</div>
			</div>
		</div>
	</VAccordion>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useTranslation } from '@/shared/lib/i18n'
import { VAccordion } from '@/shared/components/Accordion'
import localization from './CreateRecipeTime.localization.json'

const { t } = useTranslation(localization)

const kitchenTime = ref<string>('')
const cookingTime = ref<string>('')

const formatInput = (event: Event) => {
	const target = event.target as HTMLInputElement
	target.value = formatTime(target.value)

	if (target === document.activeElement) {
		if (target.value === kitchenTime.value) {
			kitchenTime.value = target.value
		} else {
			cookingTime.value = target.value
		}
	}
}

watch([kitchenTime, cookingTime], ([newKitchenTime, newCookingTime]) => {
	kitchenTime.value = formatTime(newKitchenTime)
	cookingTime.value = formatTime(newCookingTime)
})

const formatTime = (value: string) => {
	let formattedValue = value.replace(/[^0-9]/g, '')
	if (formattedValue.length > 4) {
		formattedValue = formattedValue.slice(0, 4)
	}

	if (formattedValue.length <= 2) {
		return formattedValue
	} else if (formattedValue.length <= 3) {
		return formattedValue.slice(0, 2) + ' ' + t('hour') + ' : ' + formattedValue.slice(2)
	} else {
		return formattedValue.slice(0, 2) + ' ' + t('hour') + ' : ' + formattedValue.slice(2, 4) + ' ' + t('minute')
	}
}
</script>

<style scoped>
.border {
	border: 1px solid #E1E1E1;
}

.padding-filled {
	padding: 26px 0 10px 12px;
}

.padding-empty {
	padding: 16px 8px;
}
</style>