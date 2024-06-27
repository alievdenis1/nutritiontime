<template>
	<svg
		width="14"
		height="14"
		viewBox="0 0 9 9"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<path
			d="M8.36731 3.26562V4.96094H0.570435V3.26562H8.36731ZM5.38293 0.0781248V8.35937H3.56262V0.0781248H5.38293Z"
			:fill="iconColor"
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