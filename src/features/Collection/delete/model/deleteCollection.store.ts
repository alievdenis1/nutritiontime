import { defineStore } from 'pinia'
import { Collection } from 'entities/Сollection/types/typesCollection.ts'
import { deletePlan } from '../api'
import { ElMessage } from 'element-plus'

type State = {
	isLoadingDeleteCollection: boolean
}

export const useDeleteCollectionStore = defineStore({
	id: 'delete-plan-store',
	state: (): State => ({
		isLoadingDeleteCollection: false
	}),
	actions: {
		deleteCollection(planId: Collection['id']) {
			this.isLoadingDeleteCollection = true
			return deletePlan(planId)
				.then(() => {
					ElMessage.success('План удален!')
				})
				.finally(() => {
					this.isLoadingDeleteCollection = false
				})
		}
	}
})
