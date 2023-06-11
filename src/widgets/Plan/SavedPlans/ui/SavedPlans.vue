<template>
	<div>
		<plan-actions-dialog
			v-if="selectedPlan"
			v-model="isActionsDialogVisible"
			:plan="selectedPlan"
		/>

		<saved-plans-list
			class="mb-[20px]"
			@action="onSavedPlanActionButtonClicked"
		/>

		<generate-new-plan />
	</div>
</template>

<script setup lang="ts">
import { SavedPlansList, usePlansStore } from 'entities/Plan'
import PlanActionsDialog from './PlanActionsDialog.vue'
import { Plan } from 'entities/Plan/types'
import { ref } from 'vue'
import { GenerateNewPlan } from 'features/Plan/generate-new'

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
