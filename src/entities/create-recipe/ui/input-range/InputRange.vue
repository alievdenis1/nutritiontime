<template>
	<div>
		<el-slider
			:step="15"
			show-stops
			:marks="marks"
			max="75"
		/>
	</div>
</template>

<script setup lang="ts">
import type { Marks } from '../../types'

defineProps<{
	marks: Marks,
}>()
</script>

<style scoped>

</style>