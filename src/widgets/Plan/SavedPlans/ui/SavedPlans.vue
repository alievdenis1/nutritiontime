<template>
	<div>
		<plan-actions-dialog
			v-if="selectedPlan"
			v-model="isActionsDialogVisible"
			:plan="selectedPlan"
		/>

		<saved-plans-list
<<<<<<< HEAD
=======
			:items="plansStore.savedPlans"
>>>>>>> 4db838b8ef327e434b610b143407db4e4e5be584
			class="mb-8"
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
