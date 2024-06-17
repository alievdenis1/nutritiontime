<template>
	<div
		class="w-full h-[42px] py-[6px] px-3 flex bg-white rounded-[40px] gap-[5px]"
	>
		<div
			v-for="tag in tags"
			:key="tag.id"
			class="p-2 flex items-center justify-center rounded-[40px] bg-[#735F2B] text-white"
		>
			{{ tag.name }}
		</div>
	</div>
</template>

<script setup lang="ts">
import { Tag } from '../../types'

defineProps<{
  tags: Tag[];
}>()
</script>

<style scoped></style>
