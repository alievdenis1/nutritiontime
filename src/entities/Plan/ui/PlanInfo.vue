<template>
	<div class="flex flex-col">
		<span
			class="text-sm font-medium"
			:class="plan.isActive ? 'text-brown' : 'text-green'"
		>
			{{ plan.name }}
		</span>

		<span class="text-sm text-brown font-light">
			{{ plan.caloriesPerDay }} ккал/день
		</span>

		<span class="text-sm text-brown font-light">
			БЖУ {{ `${plan.proteins}/${plan.fats}/${plan.carbohydrates}` }}
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
