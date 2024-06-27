import { defineStore } from 'pinia'
import { copyPlan } from '../api'
import { Collection } from 'entities/Сollection/types/typesCollection.ts'
import { ElMessage } from 'element-plus'

type State = {
	isLoadingCopyCollection: boolean
}

export const useCopyCollectionStore = defineStore({
	id: 'copy-collection-store',
	state: (): State => ({
		isLoadingCopyCollection: false
	}),
	actions: {
		copyCollection(planId: Collection['id']) {
			this.isLoadingCopyCollection = true
			return copyPlan(planId).finally(() => {
				this.isLoadingCopyCollection = false
				ElMessage.success({ message: 'План скопирован!' })
			})
		}
	}
})

