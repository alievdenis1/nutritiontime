import { emulateRequest } from 'shared/lib/debug'
import { Collection } from 'entities/Сollection/types/typesCollection.ts'

export const copyPlan = (planId: Collection['id']) => {
	console.log(planId)
	return emulateRequest({ milliSeconds: 1500 })
}
