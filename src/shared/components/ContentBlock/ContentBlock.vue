<template>
	<div
		class="flex flex-col items-center p-4 max-w-md mx-auto"
		:class="{ 'mt-[80px]': buttonText == 'Создать свой рецепт'}"
	>
		<img
			:src="image"
			alt="Placeholder image"
			class="w-[250px] h-[250px] mb-4"
		>
		<p class="text-center mb-4">
			{{ text }}
		</p>
		<button
			:class="buttonClass"
			class="px-[32px] py-[10px] rounded-lg font-semibold flex items-center justify-center gap-[8px] transition duration-300 hover:bg-opacity-90 bg-[#319A6E] rounded-[20px]"
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
import { IconArrowRight, IconPlus  } from '../Icon'

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