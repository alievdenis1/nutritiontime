<template>
	<div class="flex flex-row gap-3 w-full overflow-auto scroll-hide">
		<v-button
			v-for="item in caloriesList"
			:key="item.id"
			class="bg-white min-w-[70px] h-[50px] py-[18px] px-[13px] flex gap-1 items-end rounded-[40px] cursor-pointer"
		>
			<img
				src="/image/icons/icon-fire.svg"
				width="12"
			>
			<span class="text-[10px] text-[#735F2B] leading-[94.95%]">
				{{ `${item.count} kal` }}
			</span>
		</v-button>
	</div>
</template>

<script setup lang="ts">
import type { CaloriesItem } from '../../types'

defineProps<{
	caloriesList: CaloriesItem[],
}>()

</script>

<style scoped>
.scroll-hide::-webkit-scrollbar {
	display: none;
}

.scroll-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>