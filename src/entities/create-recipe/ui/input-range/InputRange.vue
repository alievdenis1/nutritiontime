<template>
	<div>
		<el-slider
			:step="15"
			show-stops
			:marks="marks"
			max="75"
			:model-value="modelValue"
			@input="emit('update:modelValue', $event)"
		/>
	</div>
</template>

<script setup lang="ts">
import type { Marks } from '../../types'

defineProps<{
	marks: Marks,
	modelValue: number
}>()

const emit = defineEmits(['update:modelValue'])
</script>

<style scoped>

</style>