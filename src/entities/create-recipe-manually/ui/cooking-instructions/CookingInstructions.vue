<template>
	<div class="flex flex-col text-[#9D8C61] text-[15px] gap-3">
		<div class="instruction flex items-center justify-between">
			<span class="ml-[90px]">
				Cooking instructions
			</span>
			<v-button class="cursor-pointer">
				<img
					src="/image/icons/icon-pen.svg"
					width="17"
				>
			</v-button>
		</div>
		<div
			class="instruction flex items-center justify-between"
		>
			<span class="ml-[120px]">
				Snan First
			</span>
			<v-button class="cursor-pointer">
				<img
					src="/image/icons/icon-plus-rounded.svg"
					width="17"
				>
			</v-button>
		</div>

		<div
			class="bg-white px-3 py-6 rounded-[40px] text-center"
		>
			<span class="py-[10px]">
				Dop Info
			</span>
		</div>
	</div>
</template>

<script setup lang="ts">

</script>

<style scoped>
.instruction {
	@apply bg-white p-3 rounded-[40px]
}
</style>