import { Plan } from 'entities/Plan/types'
import { emulateRequest } from 'shared/lib/debug'

export const deletePlan = (planId: Plan['id']) => {
	console.log(planId)
	return emulateRequest({ milliSeconds: 1000 })
}
