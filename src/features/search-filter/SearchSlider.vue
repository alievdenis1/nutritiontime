<template>
	<div>
		<div>
			<h3 class="text-darkGray text-sm mb-2">
				{{ t('spiciness') }}
			</h3>
			<div class="flex items-center justify-center mb-2 gap-[12px]">
				<div class="relative border-slide w-full">
					<span class="absolute top-[6px] left-[12px] text-xs text-gray">
						{{ t('from') }}
					</span>
					<input
						v-model="spicyInputStart"
						type="number"
						min="1"
						max="5"
						class="h-[56px] px-[12px] pt-[26px] pb-[12px] text-slateGray rounded text-sm w-full"
						@input="validateSpicyInput"
					>
				</div>
				<div class="relative border-slide w-full">
					<span class="absolute top-[6px] left-[12px] text-xs text-gray">
						{{ t('to') }}
					</span>
					<input
						v-model="spicyInputEnd"
						type="number"
						min="1"
						max="5"
						class="h-[56px] px-[12px] pt-[26px] pb-[12px] text-slateGray rounded text-sm w-full"
						@input="validateSpicyInput"
					>
				</div>
			</div>
			<VSlider
				v-model="spicyModelValue"
				:min="1"
				:max="5"
				:step="1"
				class="mt-[12px] mb-[20px] h-[28px]"
			/>
		</div>

		<div>
			<h3 class="text-darkGray text-sm mb-2">
				{{ t('cookingDifficulty') }}
			</h3>
			<div class="flex items-center justify-center mb-2 gap-[12px]">
				<div class="relative border-slide w-full">
					<span class="absolute top-[6px] left-[12px] text-xs text-gray">
						{{ t('from') }}
					</span>
					<input
						v-model="difficultyInputStart"
						type="number"
						min="1"
						max="5"
						class="h-[56px] px-[12px] pt-[26px] pb-[12px] text-slateGray rounded text-sm w-full"
						@input="validateDifficultyInput"
					>
				</div>
				<div class="relative border-slide w-full">
					<span class="absolute top-[6px] left-[12px] text-xs text-gray">
						{{ t('to') }}
					</span>
					<input
						v-model="difficultyInputEnd"
						type="number"
						min="1"
						max="5"
						class="h-[56px] px-[12px] pt-[26px] pb-[12px] text-slateGray rounded text-sm w-full"
						@input="validateDifficultyInput"
					>
				</div>
			</div>
			<VSlider
				v-model="difficultyModelValue"
				:min="1"
				:max="5"
				:step="1"
				class="mt-[12px] mb-[20px] h-[28px]"
			/>
		</div>

		<div class="mb-[20px] mt-[20px] relative">
			<div class="relative">
				<span
					v-if="selectedTime"
					class="absolute text-sm top-[6px] left-[12px] text-gray"
				>
					{{ t('cookingTime') }}
				</span>
				<input
					v-model="selectedTime"
					type="text"
					:placeholder="t('cookingTime')"
					class="border-slide rounded text-base w-full h-[54px] cursor-pointer"
					:class="{ 'padding-filled': selectedTime, 'padding-empty': !selectedTime }"
					readonly
					@click="toggleDropdown"
				>
				<IconArrow
					:class="['absolute right-[12px] top-1/2 transform -translate-y-1/2 transition-transform w-[24px] h-[24px]', { 'rotate-180': isOpen }]"
					icon-color="#1C1C1C"
				/>
			</div>
			<div
				v-if="isOpen"
				class="mt-2 bg-white border rounded-md shadow-lg absolute left-0 right-0 z-10"
			>
				<div
					v-for="time in timeOptions"
					:key="time.value"
					class="px-4 py-2 hover:bg-lightGray cursor-pointer"
					@click="selectTime(time)"
				>
					{{ time.label }}
				</div>
			</div>
			<div class="flex flex-wrap gap-2 mt-4">
				<button
					v-for="tag in timeOptions"
					:key="tag.value"
					class="px-4 py-2 bg-lightGray rounded-full text-sm text-slateGray hover:bg-transparentGreen hover:text-forestGreen transition-colors duration-200"
					@click="selectTime(tag)"
				>
					{{ tag.label }}
				</button>
			</div>
		</div>

		<!--		<div>-->
		<!--			<h3 class="text-darkGray text-sm mb-2">-->
		<!--				{{ t('dishRating') }}-->
		<!--			</h3>-->
		<!--			<div class="flex items-center justify-center mb-2 gap-[12px]">-->
		<!--				<div class="relative border-slide w-full">-->
		<!--					<span class="absolute top-[6px] left-[12px] text-xs text-gray">-->
		<!--						{{ t('from') }}-->
		<!--					</span>-->
		<!--					<input-->
		<!--						v-model="ratingInputStart"-->
		<!--						type="number"-->
		<!--						min="1"-->
		<!--						max="5"-->
		<!--						class="h-[56px] px-[12px] pt-[26px] pb-[12px] text-slateGray rounded text-sm w-full"-->
		<!--						@input="validateRatingInput"-->
		<!--					>-->
		<!--				</div>-->
		<!--				<div class="relative border-slide w-full">-->
		<!--					<span class="absolute top-[6px] left-[12px] text-xs text-gray">-->
		<!--						{{ t('to') }}-->
		<!--					</span>-->
		<!--					<input-->
		<!--						v-model="ratingInputEnd"-->
		<!--						type="number"-->
		<!--						min="1"-->
		<!--						max="5"-->
		<!--						class="h-[56px] px-[12px] pt-[26px] pb-[12px] text-slateGray rounded text-sm w-full"-->
		<!--						@input="validateRatingInput"-->
		<!--					>-->
		<!--				</div>-->
		<!--			</div>-->
		<!--			<VSlider-->
		<!--				v-model="ratingModelValue"-->
		<!--				:min="1"-->
		<!--				:max="5"-->
		<!--				:step="1"-->
		<!--				class="mt-[12px] mb-[20px] h-[28px]"-->
		<!--			/>-->
		<!--		</div>-->
	</div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { VSlider } from '@/shared/components/ui/slider'
import { IconArrow } from '@/shared/components/Icon'
import { useTranslation } from '@/shared/lib/i18n'
import localization from './SearchFilter.localization.json'
import { useSearchStore } from 'entities/Recipe/Search'

const { t } = useTranslation(localization)
const store = useSearchStore()

// Острота
const spicyModelValue = ref([1, 5])
const spicyInputStart = ref('1')
const spicyInputEnd = ref('5')

watch(spicyModelValue, (newSpicinessRange) => {
	store.filters.min_spiciness = newSpicinessRange[0]
	store.filters.max_spiciness = newSpicinessRange[1]
}, { deep: true })

// Сложность
const difficultyModelValue = ref([1, 5])
const difficultyInputStart = ref('1')
const difficultyInputEnd = ref('5')

watch(difficultyModelValue, (newDifficultyRange) => {
	store.filters.min_difficulty = newDifficultyRange[0]
	store.filters.max_difficulty = newDifficultyRange[1]
}, { deep: true })

// Рейтинг
const ratingModelValue = ref([1, 5])
const ratingInputStart = ref('1')
const ratingInputEnd = ref('5')

watch(ratingModelValue, (newRatingRange) => {
	store.filters.min_rating = newRatingRange[0]
	store.filters.max_rating = newRatingRange[1]
}, { deep: true })

const validateInput = (start: string, end: string, min: number, max: number) => {
	let startNum = Number(start)
	let endNum = Number(end)

	startNum = Math.max(min, Math.min(max, startNum))
	endNum = Math.max(min, Math.min(max, endNum))

	if (startNum > endNum) {
		[startNum, endNum] = [endNum, startNum]
	}

	return [startNum.toString(), endNum.toString()]
}

const validateSpicyInput = () => {
	[spicyInputStart.value, spicyInputEnd.value] = validateInput(spicyInputStart.value, spicyInputEnd.value, 0, 5)
	spicyModelValue.value = [Number(spicyInputStart.value), Number(spicyInputEnd.value)]
}

const validateDifficultyInput = () => {
	[difficultyInputStart.value, difficultyInputEnd.value] = validateInput(difficultyInputStart.value, difficultyInputEnd.value, 0, 5)
	difficultyModelValue.value = [Number(difficultyInputStart.value), Number(difficultyInputEnd.value)]
}

const validateRatingInput = () => {
	[ratingInputStart.value, ratingInputEnd.value] = validateInput(ratingInputStart.value, ratingInputEnd.value, 0, 5)
	ratingModelValue.value = [Number(ratingInputStart.value), Number(ratingInputEnd.value)]
}

watch(spicyModelValue, (newValue) => {
	spicyInputStart.value = newValue[0].toString()
	spicyInputEnd.value = newValue[1].toString()
})

watch(difficultyModelValue, (newValue) => {
	difficultyInputStart.value = newValue[0].toString()
	difficultyInputEnd.value = newValue[1].toString()
})

watch(ratingModelValue, (newValue) => {
	ratingInputStart.value = newValue[0].toString()
	ratingInputEnd.value = newValue[1].toString()
})

// Оставшийся код для времени приготовления
const selectedTime = ref(t('anyTime'))
const isOpen = ref(false)

type TimeOption = {
	label: string
	value: string
	range: {
		min?: number
		max?: number
	}
}

const timeOptions: TimeOption[] = [
	{ label: t('anyTime'), value: t('anyTime'), range: { min: undefined, max: undefined } },
	{ label: t('upTo15Min'), value: t('upTo15Min'), range: { min: 0, max: 15 } },
	{ label: t('15to30Min'), value: t('15to30Min'), range: { min: 15, max: 30 } },
	{ label: t('30to60Min'), value: t('30to60Min'), range: { min: 30, max: 60 } },
	{ label: t('moreThanHour'), value: t('moreThanHour'), range: { min: 60, max: undefined } },
]

const toggleDropdown = () => {
	isOpen.value = !isOpen.value
}

const selectTime = (time: TimeOption) => {
	selectedTime.value = time.value
	isOpen.value = false

	store.filters.min_cooking_time = time.range.min
	store.filters.max_cooking_time = time.range.max
}

onMounted(() => {
	if (typeof store.filters.min_rating === 'number' && typeof store.filters.max_rating === 'number') {
		ratingModelValue.value = [store.filters.min_rating, store.filters.max_rating]
	}

	if (typeof store.filters.min_difficulty === 'number' && typeof store.filters.max_difficulty === 'number') {
		difficultyModelValue.value = [store.filters.min_difficulty, store.filters.max_difficulty]
	}

	if (typeof store.filters.min_spiciness === 'number' && typeof store.filters.max_spiciness === 'number') {
		spicyModelValue.value = [store.filters.min_spiciness, store.filters.max_spiciness]
	}
})
</script>

<style scoped>
.padding-filled {
    padding: 26px 12px 10px 12px;
}

.padding-empty {
    padding: 16px 12px;
}

.border-slide {
    border: 1px solid rgba(49, 154, 110, 0.2);
}
</style>
