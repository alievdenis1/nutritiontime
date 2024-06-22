<template>
	<div
		class="flex flex-col items-center p-4 max-w-md mx-auto"
		:class="{ 'mt-[88px]': buttonText === 'Создать свой рецепт' || buttonText === 'Create your own recipe'}"
	>
		<img
			:src="image"
			alt="Placeholder image"
			class="w-[250px] h-[250px] mb-4"
		>
		<div class="text-center mb-4">
			<div>
				{{ t('text') }}
			</div>
			<div>
				{{ text }}
			</div>
		</div>
		<button
			:class="buttonClass"
			class="px-[32px] py-[10px] rounded-lg font-semibold flex items-center justify-center gap-[8px] transition duration-300 hover:bg-opacity-90 bg-[#319A6E] rounded-[20px] cursor-pointer"
		>
			<div>
				{{ buttonText }}
			</div>
			<IconArrowRight v-if="buttonText !== 'Создать свой рецепт'" />
			<IconPlus
				v-else
				:icon-color="'#ffffff'"
			/>
		</button>
	</div>
</template>

<script setup lang="ts">
import { IconArrowRight, IconPlus } from '../Icon'
import { useTranslation } from '@/shared/lib/i18n'
import Localization from './ContentBlock.localization.json'
const { t } = useTranslation(Localization)

defineProps({
	image: {
		type: String,
		required: true
	},
	text: {
		type: String,
		required: true
	},
	buttonText: {
		type: String,
		required: true
	},
	buttonClass: {
		type: String,
		required: true
	},
	buttonIcon: {
		type: String,
		required: false,
		default: ''
	}
})
</script>