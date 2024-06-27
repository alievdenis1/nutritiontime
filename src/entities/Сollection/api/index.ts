import { Collection } from '../types/typesCollection.ts'
import { emulateRequest } from 'shared/lib/debug'
import { DEBUG_DATA } from '../@debug'

export type GetSavedCollectionsResponseDto = {
	plans: Collection[]
}

export const getSavedCollectionsList = (): Promise<GetSavedCollectionsResponseDto> => {
	return emulateRequest().then(() => ({
		plans: DEBUG_DATA.SAVED_PLANS_LIST
	}))
}
