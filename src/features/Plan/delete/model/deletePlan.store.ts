import { defineStore } from 'pinia'
import { Plan } from 'entities/Plan/types'
import { deletePlan } from '../api'
import { ElMessage } from 'element-plus'

type State = {
	isLoadingDeletePlan: boolean
}

export const useDeletePlanStore = defineStore({
	id: 'delete-plan-store',
	state: (): State => ({
		isLoadingDeletePlan: false
	}),
	actions: {
		deletePlan(planId: Plan['id']) {
			this.isLoadingDeletePlan = true
			return deletePlan(planId)
				.then(() => {
					ElMessage.success('План удален!')
				})
				.finally(() => {
					this.isLoadingDeletePlan = false
				})
		}
	}
})
