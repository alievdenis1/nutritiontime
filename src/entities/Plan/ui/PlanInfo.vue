<template>
	<div class="flex flex-col">
		<span
			class="text-sm font-medium"
			:class="plan.isActive ? 'text-green' : 'text-brown'"
		>
			{{ plan.name }}
		</span>
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
