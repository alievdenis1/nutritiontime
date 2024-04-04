import { emulateRequest } from 'shared/lib/debug'
import { Plan } from 'entities/Plan/types'

export const copyPlan = (planId: Plan['id']) => {
	return emulateRequest({ milliSeconds: 1500 })
}
