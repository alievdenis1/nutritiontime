import { Plan } from 'entities/Plan/types/typesPlan'
import { emulateRequest } from 'shared/lib/debug'

export const deletePlan = (planId: Plan['id']) => {
	console.log(planId)
	return emulateRequest({ milliSeconds: 1000 })
}
