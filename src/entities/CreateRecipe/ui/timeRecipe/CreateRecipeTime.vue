<template>
	<VAccordion :title="t('timeRecipeTitle')">
		<div class="mt-[20px]">
			<div class="flex flex-col gap-4">
				<div class="relative">
					<span
						v-if="timeInput.length > 0"
						class="absolute text-[12px] top-[6px] left-[12px] text-gray"
					>
						{{ t('kitchenTimePlaceholder') }}
					</span>
					<input
						v-model="timeInput"
						type="text"
						:placeholder="t('kitchenTimePlaceholder')"
						class="border rounded text-base w-full h-[54px]"
						:class="{ 'padding-filled': timeInput.length > 0, 'padding-empty': timeInput.length === 0 }"
						@input="formatInput"
					>
					<p class="text-xs text-gray mt-1">
						{{ t('kitchenTimeDescription') }}
					</p>
				</div>
				<div class="relative">
					<span
						v-if="timeInput2.length > 0"
						class="absolute text-[12px] top-[6px] left-[12px] text-gray"
					>
						{{ t('cookingTimePlaceholder') }}
					</span>
					<input
						v-model="timeInput2"
						type="text"
						:placeholder="t('cookingTimePlaceholder') "
						class="border rounded text-base w-full h-[54px]"
						:class="{ 'padding-filled': timeInput2.length > 0, 'padding-empty': timeInput2.length === 0 }"
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

const timeInput = ref<string>('')
const timeInput2 = ref<string>('')

const formatInput = (event: Event) => {
    const target = event.target as HTMLInputElement
    let value = target.value.replace(/[^0-9]/g, '')

    if (value.length <= 2) {
        target.value = value
    } else if (value.length <= 4) {
        target.value = value.slice(0, 2) + ' ч : ' + value.slice(2)
    } else {
        target.value = value.slice(0, 2) + ' ч : ' + value.slice(2, 4) + ' мин'
    }

    if (target.value === timeInput.value) {
        timeInput.value = target.value
    } else {
        timeInput2.value = target.value
    }
}

watch([timeInput, timeInput2], ([newValue1, newValue2]) => {
    timeInput.value = formatWatchValue(newValue1)
    timeInput2.value = formatWatchValue(newValue2)
})

const formatWatchValue = (value: string) => {
    let formattedValue = value.replace(/[^0-9]/g, '')
    if (formattedValue.length > 4) {
        formattedValue = formattedValue.slice(0, 4)
    }
    return formatTime(formattedValue)
}

const formatTime = (value: string) => {
    if (value.length <= 2) {
        return value
    } else if (value.length <= 3) {
        return value.slice(0, 2) + ' ч : ' + value.slice(2)
    } else {
        return value.slice(0, 2) + ' ч : ' + value.slice(2, 4) + ' мин'
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
