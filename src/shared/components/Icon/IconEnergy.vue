<template>
	<svg
		width="17"
		height="24"
		viewBox="0 0 17 24"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<path
			d="M9 9H17L7 24V15H0L9 0V9ZM7 11V7.22063L3.53238 13H9V17.3944L13.263 11H7Z"
			:fill="iconColor"
		/>
	</svg>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
	iconColor: string,
}>(), {
	iconColor: '#FEB635'
})
</script>

<style scoped>

</style>