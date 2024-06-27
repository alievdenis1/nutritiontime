import { Collection } from 'entities/Сollection/types/typesCollection.ts'
import { emulateRequest } from 'shared/lib/debug'

export const deletePlan = (planId: Collection['id']) => {
	console.log(planId)
	return emulateRequest({ milliSeconds: 1000 })
}
