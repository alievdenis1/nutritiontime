<template>
	<img
		:src="props.image"
		:alt="props.title"
		class="w-full h-full object-cover"
	>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'

const props = defineProps<{
	image: string,
	title: string
}>()

</script>

<style scoped>
</style>