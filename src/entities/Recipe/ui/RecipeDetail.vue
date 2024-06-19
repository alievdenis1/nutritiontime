<template>
	<div class="w-full flex flex-col gap-4 h-full">
		<div class="flex items-center justify-between">
			<span class="opacity-70">
				{{ title }}
			</span>
			<v-button
				v-if="title"
				class="cursor-pointer"
				@click="isDropDownOpen = !isDropDownOpen"
			>
				<icon-arrow-rounded :class="{ 'rotate-180': isDropDownOpen}" />
			</v-button>
		</div>
		<div
			class="w-full bg-white rounded-[40px] px-6 "
			:class="{'py-7': isDropDownOpen, 'py-[14px]': !isDropDownOpen}"
		>
			<p>
				{{ text }}
			</p>
		</div>
	</div>
</template>

<script setup lang="ts">
import { IconArrowRounded } from '@/shared/components/Icon'
import { ref } from 'vue'

defineProps<{
	title?: string
	text?: string
}>()

const isDropDownOpen = ref(false)
</script>

<style scoped>

</style>