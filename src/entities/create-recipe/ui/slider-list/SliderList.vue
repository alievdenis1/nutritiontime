<template>
	<div class="px-[11px] py-4 bg-white flex flex-row rounded-[40px] gap-3 w-full overflow-auto scroll-hide">
		<v-button
			v-for="item in data"
			:key="item.id"
			class="bg-[#F8E1BD] rounded-[40px] min-w-[190px] h-[50px] px-[38px] py-[22px] flex items-center text-center cursor-pointer"
			:class="{'min-w-[99px] h-[58px]': isProducts}"
		>
			<span class="text-[15px] text-[#735F2B] leading-[94.95%] font-medium w-full">
				{{ item.name }}
			</span>
		</v-button>
	</div>
</template>

<script setup lang="ts">
import type { SliderItem } from '../../types'

defineProps<{
	data: SliderItem[],
	isProducts?: boolean
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