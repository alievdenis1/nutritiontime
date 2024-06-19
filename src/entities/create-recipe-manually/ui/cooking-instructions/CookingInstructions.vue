<template>
	<div class="flex flex-col text-[#9D8C61] text-[15px] gap-3">
		<div class="instruction flex items-center justify-between">
			<div class="opacity-0 w-[17px]" />
			<span>
				Cooking instructions
			</span>
			<v-button class="cursor-pointer">
				<icon-pen />
			</v-button>
		</div>
		<div
			class="instruction flex items-center justify-between"
		>
			<div class="opacity-0 w-[17px]" />
			<span>
				Snan First
			</span>
			<v-button class="cursor-pointer">
				<icon-plus-rounded />
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
import { IconPen, IconPlusRounded } from '@/shared/components/Icon'

</script>

<style scoped>
.instruction {
	@apply bg-white p-3 rounded-[40px]
}
</style>