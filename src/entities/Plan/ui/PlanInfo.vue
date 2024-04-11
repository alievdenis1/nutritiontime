<template>
	<div class="flex flex-col font-medium text-[#735F2B] gap-1 h-[28px]">
		<span
			class="text-[15px] leading-[94.95%]"
		>
			{{ plan.name }}
		</span>
		<p class="text-[10px] opacity-70 leading-[94.95%]">
			text
		</p>
	</div>
</template>

<script setup lang="ts">
import { Plan } from 'entities/Plan/types'
import { toRefs } from 'vue'

const props = defineProps<{
	plan: Plan
}>()

const { plan } = toRefs(props)
</script>

<style lang="scss" scoped></style>
