<template>
	<div>
		<plan-actions-dialog
			v-if="selectedPlan"
			v-model="isActionsDialogVisible"
			:plan="selectedPlan"
		/>

		<saved-plans-list
			class="mb-[28px]"
			@action="onSavedPlanActionButtonClicked"
		/>

	</div>
</template>

<script setup lang="ts">
import { SavedPlansList, usePlansStore } from 'entities/Plan'
import PlanActionsDialog from './PlanActionsDialog.vue'
import { Plan } from 'entities/Plan/types'
import { ref } from 'vue'

const plansStore = usePlansStore()
plansStore.fetchSavedPlans()

const selectedPlan = ref<Plan | null>(null)
const isActionsDialogVisible = ref<boolean>(false)

const onSavedPlanActionButtonClicked = (plan: Plan) => {
    selectedPlan.value = plan
	isActionsDialogVisible.value = true
}

</script>

<style lang="scss" scoped></style>
