<template>
	<svg
		width="15"
		height="20 "
		viewBox="0 0 40 40"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<path
			d="M15 10 L25 20 L15 30"
			:stroke="iconColor"
			stroke-width="5"
			fill="none"
			stroke-linecap="round"
		/>
	</svg>
</template>

<script setup lang="ts">
 withDefaults(defineProps<{
	iconColor: string,
}>(), {
	iconColor: '#ffffff'
})
</script>

<style scoped>
</style>