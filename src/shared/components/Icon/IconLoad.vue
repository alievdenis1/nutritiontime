<template>
	<svg
		width="16"
		height="18"
		viewBox="0 0 16 18"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<path
			d="M8.83333 9.0013H11.3333L8 12.3346L4.66667 9.0013H7.16667V5.66797H8.83333V9.0013ZM10.5 2.33464H2.16667V15.668H13.8333V5.66797H10.5V2.33464ZM0.5 1.49447C0.5 1.03801 0.872908 0.667969 1.33208 0.667969H11.3333L15.4998 4.83464L15.5 16.4951C15.5 16.9587 15.1292 17.3346 14.6722 17.3346H1.32783C0.870633 17.3346 0.5 16.9552 0.5 16.5081V1.49447Z"
			:fill="iconColor"
		/>
	</svg>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
	iconColor?: string,
}>(), {
	iconColor: '#319A6E'
})
</script>

<style scoped>

</style>
