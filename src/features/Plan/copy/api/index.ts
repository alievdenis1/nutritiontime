import { emulateRequest } from 'shared/lib/debug'
<<<<<<< HEAD
import { Plan } from 'entities/Plan/types'

export const copyPlan = (planId: Plan['id']) => {
	console.log(planId)
=======
// import { Plan } from 'entities/Plan/types'

export const copyPlan = () => {
>>>>>>> 4db838b8ef327e434b610b143407db4e4e5be584
	return emulateRequest({ milliSeconds: 1500 })
}
