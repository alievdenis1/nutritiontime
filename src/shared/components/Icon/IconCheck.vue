<template>
	<svg
		width="12"
		height="9"
		viewBox="0 0 12 9"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<path
			d="M1 3.7L4.54839 7L11 1"
			:stroke="iconColor"
			stroke-width="2"
		/>
	</svg>
</template>

<script setup lang="ts">
    withDefaults(defineProps<{
        iconColor: string,
    }>(), {
        iconColor: '#319A6E'
    })
</script>

<style scoped>

</style>