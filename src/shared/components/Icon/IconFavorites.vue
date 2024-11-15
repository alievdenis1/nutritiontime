<template>
	<svg
		width="24"
		height="24"
		viewBox="0 0 24 24"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		:class="{ 'cursor-pointer': !disabled }"
		@click="$emit('toggle')"
	>
		<path
			v-if="!isLiked"
			d="M5 2H19C19.5523 2 20 2.44772 20 3V22.1433C20 22.4194 19.7761 22.6434 19.5 22.6434C19.4061 22.6434 19.314 22.6168 19.2344 22.5669L12 18.0313L4.76559 22.5669C4.53163 22.7136 4.22306 22.6429 4.07637 22.4089C4.02647 22.3293 4 22.2373 4 22.1433V3C4 2.44772 4.44772 2 5 2ZM18 4H6V19.4324L12 15.6707L18 19.4324V4Z"
			:fill="defaultColor"
			stroke-width="1.5"
		/>
		<path
			v-else
			d="M5 2H19C19.5523 2 20 2.44772 20 3V22.1433C20 22.4194 19.7761 22.6434 19.5 22.6434C19.4061 22.6434 19.314 22.6168 19.2344 22.5669L12 18.0313L4.76559 22.5669C4.53163 22.7136 4.22306 22.6429 4.07637 22.4089C4.02647 22.3293 4 22.2373 4 22.1433V3C4 2.44772 4.44772 2 5 2Z"
			:fill="iconColor"
		/>
	</svg>
</template>

<script setup lang="ts">
interface Props {
	isLiked?: boolean
	defaultColor?: string
	iconColor?: string
	disabled?: boolean
}

withDefaults(defineProps<Props>(), {
	defaultColor: '#9F9FA0',
	iconColor: '#319A6E',
	disabled: false
})

defineEmits<{
	(e: 'toggle'): void
}>()
</script>

<style scoped>
.cursor-pointer {
	cursor: pointer;
}
</style>