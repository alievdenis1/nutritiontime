<template>
	<svg
		width="23"
		height="20"
		viewBox="0 0 23 20"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<path
			d="M19.5 12V15H22.5V17H19.5V20H17.5V17H14.5V15H17.5V12H19.5ZM19.5082 0C20.056 0 20.5 0.44495 20.5 0.9934V10H18.5V2H2.5V15.999L12.5 6L15.5 9V11.829L12.5 8.8284L5.327 16H12.5V18H1.4918C0.94405 18 0.5 17.5551 0.5 17.0066V0.9934C0.5 0.44476 0.95531 0 1.4918 0H19.5082ZM6.5 4C7.60457 4 8.5 4.89543 8.5 6C8.5 7.1046 7.60457 8 6.5 8C5.39543 8 4.5 7.1046 4.5 6C4.5 4.89543 5.39543 4 6.5 4Z"
			:fill="iconColor"
		/>
	</svg>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
	iconColor: string,
}>(), {
	iconColor: '#1C1C1C'
})
</script>

<style scoped>

</style>