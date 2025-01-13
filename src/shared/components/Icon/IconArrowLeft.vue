<script setup lang="ts">
withDefaults(defineProps<{
	iconColor?: string
}>(), {
	iconColor: '#1C1C1C'
})
</script>

<template>
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width="20"
		height="20"
		viewBox="0 0 20 20"
		fill="none"
	>
		<path
			d="M6.52399 10.8329L10.994 15.3029L9.81549 16.4814L3.33366 9.99959L9.81549 3.51784L10.994 4.69634L6.52399 9.16626L16.667 9.16626L16.667 10.8329L6.52399 10.8329Z"
			:fill="iconColor"
		/>
	</svg>
</template>

<style module>

</style>
