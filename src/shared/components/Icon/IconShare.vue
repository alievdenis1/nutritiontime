<template>
	<svg
		width="18"
		height="15"
		viewBox="0 0 18 15"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<path
			d="M8.83333 9.66732H7.16667C4.28502 9.66732 1.78294 11.2925 0.526992 13.6762C0.509108 13.4534 0.5 13.2281 0.5 13.0007C0.5 8.39832 4.23096 4.66732 8.83333 4.66732V0.0839844L17.5833 7.16732L8.83333 14.2507V9.66732ZM7.16667 8.00065H10.5V10.7572L14.9345 7.16732L10.5 3.57752V6.33398H8.83333C6.81625 6.33398 5.00843 7.22973 3.78593 8.64524C4.84061 8.22682 5.98368 8.00065 7.16667 8.00065Z"
			:fill="iconColor"
		/>
	</svg>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
	iconColor?: string,
}>(), {
	iconColor: '#9F9FA0'
})
</script>

<style scoped>

</style>
