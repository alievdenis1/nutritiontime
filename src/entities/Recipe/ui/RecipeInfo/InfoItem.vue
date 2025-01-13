<template>
	<div class="flex justify-between">
		<span class="text-sm text-slateGray">{{ props.title }}</span>
		<span class="flex flex-grow text-sm font-medium text-darkGray dashed-gap">{{ props.value }}</span>
	</div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'

const props = withDefaults(defineProps<{
	title?: string,
	value?: string,
}>(), {
	title: '',
	value: '',
})

</script>

<style scoped>
.dashed-gap::before {
    content: '';
    border-bottom: 1px dashed rgba(28, 28, 28, 0.05);
    flex-grow: 1;
    margin: 0 5px;
}
</style>

