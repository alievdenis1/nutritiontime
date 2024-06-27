import { defineStore } from 'pinia'
import { Collection } from 'entities/Сollection/types/typesCollection.ts'
import { getSavedCollectionsList } from '../api'

type State = {
	savedPlans: Collection[],
	isLoadingSavedPlans: boolean
}

export const useCollectionStore = defineStore({
	id: 'collection-store',
	state: (): State => ({
		savedPlans: [],
		isLoadingSavedPlans: false
	}),
	actions: {
		fetchSavedCollections() {
			this.isLoadingSavedPlans = true
			return getSavedCollectionsList()
				.then((response) => {
					this.savedPlans = response.plans
				})
				.finally(() => {
					this.isLoadingSavedPlans = false
				})
		}
	}
})
