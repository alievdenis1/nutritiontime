<template>
	<v-collapse
		v-loading="isLoadingSavedPlans"
		:data="savedPlans"
		title-key="name"
		:title="t('myCollection')"
		name-key="id"
		@generate="onGenerateNewPlan"
	>
		<template #item="{ item }">
			<div class="flex justify-between items-center">
				<plan-info
					:plan="{
						name: item.name as string,
						id: item.id as number,
						isActive: item.isActive as boolean,
						caloriesPerDay: item.caloriesPerDay as number,
						proteins: item.proteins as number,
						fats: item.fats as number,
						carbohydrates: item.carbohydrates as number
					}"
				/>

				<v-button
					class="flex items-center cursor-pointer"
					@click="onActionButtonClicked({
						name: item.name as string,
						id: item.id as number,
						isActive: item.isActive as boolean,
						caloriesPerDay: item.caloriesPerDay as number,
						proteins: item.proteins as number,
						fats: item.fats as number,
						carbohydrates: item.carbohydrates as number
					})"
				>
					<img
						src="/image/icons/icon-more.svg"
						width="15"
						class="rotate-90"
					>
				</v-button>
			</div>
		</template>
	</v-collapse>
</template>

<script setup lang="ts">
import { usePlansStore } from '../model'
import { storeToRefs } from 'pinia'
import PlanInfo from './PlanInfo.vue'
import { VCollapse } from 'shared/components/Collapse'
import { type Plan } from '../types'
import Localization from './SavedPlansList.localization.json'
import { useTranslation } from '@/shared/lib/i18n'

defineProps<{
  items: Plan[]
}>()

const { t } = useTranslation(Localization)

const emit = defineEmits<{
	(event: 'action', value: Plan): void
}>()

const store = usePlansStore()
const { savedPlans, isLoadingSavedPlans } = storeToRefs(store)

const onGenerateNewPlan = () => {
	console.log('new plan created')
}

const onActionButtonClicked = (plan: Plan) => {
	emit('action', plan)
}
</script>
