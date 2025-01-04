<template>
	<div
		class="flex items-center justify-between bg-lightGray px-[12px] py-[20px] rounded-[16px]"
	>
		<span class="text-[12px]">{{ props.title }}</span>
		<span class="text-[#535353] text-xs">{{ props.value }}</span>
	</div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'

const props = defineProps<{
	title: string,
	value: string,
}>()

</script>

<style scoped>
</style>

