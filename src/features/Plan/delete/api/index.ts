import { Plan } from 'entities/Plan/types'
import { emulateRequest } from 'shared/lib/debug'

export const deletePlan = (planId: Plan['id']) => {
<<<<<<< HEAD
	console.log(planId)
=======
>>>>>>> 4db838b8ef327e434b610b143407db4e4e5be584
	return emulateRequest({ milliSeconds: 1000 })
}
