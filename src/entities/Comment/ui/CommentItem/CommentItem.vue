<template>
	<div class="rounded-lg flex flex-col gap-[12px]">
		<div class="flex items-center">
			<img
				v-if="props.authorImage"
				:src="props.authorImage"
				:alt="props.authorName"
				class="w-8 h-8 rounded-full mr-2"
			>
			<span class="font-xs text-slateGray">{{ props.authorName }}</span>
		</div>
		<p class="text-darkGray">
			{{ props.text }}
		</p>
		<img
			v-if="props.image"
			:src="props.image"
			alt="image to comment"
			class="w-full h-auto object-cover aspect-video rounded-lg"
		>
		<slot />
	</div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'

const props = defineProps<{
    authorName: string,
    authorImage?: string;
    text: string,
    image?: string,
}>()

</script>

<style scoped>
</style>

