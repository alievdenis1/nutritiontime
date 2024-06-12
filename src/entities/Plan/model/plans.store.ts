import { defineStore } from 'pinia'
import { Plan } from 'entities/Plan/types'
import { getSavedPlansList } from '../api'

type State = {
	savedPlans: Plan[],
	isLoadingSavedPlans: boolean
}

export const usePlansStore = defineStore({
	id: 'plans-store',
	state: (): State => ({
		savedPlans: [],
		isLoadingSavedPlans: false
	}),
	actions: {
		fetchSavedPlans() {
			this.isLoadingSavedPlans = true
			return getSavedPlansList()
				.then((response) => {
					this.savedPlans = response.plans
				})
				.finally(() => {
					this.isLoadingSavedPlans = false
				})
		}
	}
})
