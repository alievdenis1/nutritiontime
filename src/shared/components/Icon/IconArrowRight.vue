<template>
	<svg
		width="21"
		height="20"
		viewBox="0 0 21 20"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<path
			d="M13.976 9.16658L9.50601 4.69657L10.6845 3.51807L17.1663 9.99992L10.6845 16.4817L9.50601 15.3032L13.976 10.8332H3.83301V9.16658H13.976Z"
			:fill="iconColor"
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