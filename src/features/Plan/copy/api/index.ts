import { emulateRequest } from 'shared/lib/debug'
// import { Plan } from 'entities/Plan/types'

export const copyPlan = () => {
	return emulateRequest({ milliSeconds: 1500 })
}
