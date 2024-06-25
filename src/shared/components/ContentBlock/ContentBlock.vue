<template>
	<div class="flex flex-col items-center p-4 max-w-md mx-auto">
		<img
			:src="image"
			alt="Placeholder image"
			class="w-[250px] h-[250px] mb-4"
		>
		<div class="text-center mb-4">
			<div>{{ t('text') }}</div>
			<div>{{ text }}</div>
		</div>
		<button
			:class="buttonClass"
			class="px-[32px] py-[10px] rounded-lg font-semibold flex items-center justify-center gap-[8px] transition duration-300 hover:bg-opacity-90 bg-[#319A6E] rounded-[20px] cursor-pointer"
		>
			<div>{{ buttonText }}</div>
			<component
				:is="buttonIcon"
				:icon-color="'#ffffff'"
			/>
		</button>
	</div>
</template>

<script setup lang="ts">
import { DefineComponent } from 'vue'
import { useTranslation } from '@/shared/lib/i18n'
import Localization from './ContentBlock.localization.json'
const { t } = useTranslation(Localization)

defineProps<{
	buttonIcon: DefineComponent,
	buttonClass: string,
	buttonText: string,
	text: string,
	image: string
}>()
</script>