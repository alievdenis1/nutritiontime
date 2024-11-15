<template>
	<div
		:class="['p-1 border-1 border-solid rounded-[50%]',{
			'border-[#319a6e] border-opacity-20': active,
			'border-[#E1E1E1]': !active
		}]"
	>
		<svg
			width="10"
			height="10"
			viewBox="0 0 10 10"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<circle
				:class="{'hidden': !active}"
				cx="5"
				cy="5"
				r="5"
				:fill="iconColor"
				stroke="#E1E1E1"
			/>
		</svg>
	</div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
    iconColor: string,
	active: boolean,
}>(), {
    iconColor: '#ffffff',
	active: false,
})
</script>

<style scoped>

</style>