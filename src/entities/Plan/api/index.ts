import { Plan } from '../types/typesPlan'
import { emulateRequest } from 'shared/lib/debug'
import { DEBUG_DATA } from '../@debug'

export type GetSavedPlansResponseDto = {
	plans: Plan[]
}

export const getSavedPlansList = (): Promise<GetSavedPlansResponseDto> => {
	return emulateRequest().then(() => ({
		plans: DEBUG_DATA.SAVED_PLANS_LIST
	}))
}
