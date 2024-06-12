import { defineStore } from 'pinia'
import { copyPlan } from '../api'
import { Plan } from 'entities/Plan/types'
import { ElMessage } from 'element-plus'

type State = {
	isLoadingCopyPlan: boolean
}

export const useCopyPlanStore = defineStore({
	id: 'copy-plan-store',
	state: (): State => ({
		isLoadingCopyPlan: false
	}),
	actions: {
		copyPlan(planId: Plan['id']) {
			this.isLoadingCopyPlan = true
			return copyPlan(planId).finally(() => {
				this.isLoadingCopyPlan = false
				ElMessage.success({ message: 'План скопирован!' })
			})
		}
	}
})

