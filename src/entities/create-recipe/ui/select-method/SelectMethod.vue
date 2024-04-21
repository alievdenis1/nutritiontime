<template>
	<button
		class="select-method"
		@click.prevent="toggleMethodsList"
	>
		<span
			v-if="!chosenMethods.length"
			class="text-[15px]"
		>
			{{ t('choose') }}
		</span>

		<div
			v-else
			class="flex flex-wrap gap-1 w-full"
		>
			<button
				v-for="chosenMethod in chosenMethods"
				:key="chosenMethod"
				class="tag"
				@click.prevent.stop="removeCookingMethod(chosenMethod)"
			>
				{{ chosenMethod }}
				<img
					class="rotate-45 text-white"
					src="image/icons/icon-plus.svg"
					width="10"
				>
			</button>
		</div>
		<img
			width="12"
			src="image/icons/icon-select.svg"
		>

		<div
			class="flex flex-col text-center absolute top-10 left-0 bg-white w-[160px] z-20 rounded-[10px]"
			:class="{'hidden': !isMethodsListOpen}"
		>
			<v-button
				v-for="method in methods"
				:key="method.id"
				class="method-btn"
				@click.prevent.stop="chooseCookingMethod(method.value)"
			>
				<span class="text-[13px] font-normal text-[#735F2B]">
					{{ method.value }}
				</span>
				<v-divider
					v-if="methods[methods.length - 1].id !== method.id"
					style="background-color: #735F2B;"
				/>
			</v-button>
		</div>
	</button>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { VDivider } from 'shared/components/Divider'
import type { CookingMethod } from '../../types'

import Localization from './SelectMethod.localization.json'
import { useTranslation } from '@/shared/lib/i18n'

const { t } = useTranslation(Localization)

const isMethodsListOpen = ref<boolean>(false)
const chosenMethods = ref<string[]>([])

const toggleMethodsList = () => {
	isMethodsListOpen.value = !isMethodsListOpen.value
}

defineProps<{
	modelValue: CookingMethod[]
}>()

const emit = defineEmits<{
	(event: 'update:modelValue', chosenMethods)
}>()

const chooseCookingMethod = (value: string) => {
	if( chosenMethods.value.length !== 5 && !chosenMethods.value.includes(value)) {
		chosenMethods.value.push(value)
		emit('update:modelValue', chosenMethods.value)
	}
	isMethodsListOpen.value = !isMethodsListOpen.value
}

const removeCookingMethod = (method: string) => {
	chosenMethods.value = chosenMethods.value.filter(item => item !== method)
	emit('update:modelValue', chosenMethods.value)
}

const methods = [
	{ id: 1, value: 'hot' },
	{ id: 2, value: 'trick' },
	{ id: 3, value: 'steamed' },
	{ id: 4, value: 'pickling' },
	{ id: 5, value: 'on fire' },
	{ id: 6, value: 'grill' },
]
</script>

<style lang="scss" scoped>
.select-method {
	@apply p-[15px] bg-white h-11 w-[237px] flex items-center justify-between rounded-[40px]
	placeholder:text-[#735F2B] placeholder:opacity-60 cursor-pointer pr-[30px] relative
}

.method_btn {
	@apply bg-white text-[#735F2B] w-full text-center cursor-pointer
}

.tag {
	@apply px-1 gap-1 bg-[#735F2B] text-white rounded-[15px] text-[13px] font-normal flex
}

</style>