<template>
	<svg
		width="22"
		height="23"
		viewBox="0 0 22 23"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<circle
			cx="10"
			cy="10"
			r="9.5"
			:stroke="iconColor"
		/>
		<path
			d="M16.5 17.5L21.5 22.5"
			:stroke="iconColor"
			stroke-linecap="round"
		/>
	</svg>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
	iconColor: string,
}>(), {
	iconColor: '#9F9FA0'
})
</script>

<style scoped>

</style>