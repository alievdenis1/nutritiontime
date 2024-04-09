<template>
	<div class="flex flex-col">
		<span
			class="text-sm font-medium"
			:class="plan.isActive ? 'text-brown' : 'text-green'"
		>
			{{ plan.name }}
		</span>

		<span class="text-sm text-brown font-light">
			{{ plan.caloriesPerDay }} {{ t('caloriesPerDay') }}
		</span>

		<span class="text-sm text-brown font-light">
			{{ t('pfc') }} {{ `${plan.proteins}/${plan.fats}/${plan.carbohydrates}` }}
		</span>
	</div>
</template>

<script setup lang="ts">
import { Plan } from 'entities/Plan/types'
import { toRefs } from 'vue'
import Localization from './PlanInfo.localization.json'
import { useTranslation } from '@/shared/lib/i18n'

const { t } = useTranslation(Localization)

const props = defineProps<{
	plan: Plan
}>()

const { plan } = toRefs(props)
</script>

<style lang="scss" scoped></style>
