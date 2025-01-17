import { Collection } from '../types/typesCollection.ts'
import { emulateRequest } from 'shared/lib/debug'
import { DEBUG_DATA } from '../@debug'
import useApi, { api } from 'shared/lib/api/use-api.ts'
import { MaybeRefOrGetter, toValue } from 'vue'

export type GetSavedCollectionsResponseDto = {
	plans: Collection[]
}

export const getSavedCollectionsList = (): Promise<GetSavedCollectionsResponseDto> => {
	return emulateRequest().then(() => ({
		plans: DEBUG_DATA.SAVED_PLANS_LIST
	}))
}

export const getCollectionList = () => {
	return useApi('get', '/collections', )
}

export const getCollectionListV2 = async () => {
	const response = await api.get<Collection[]>('/collections')
	return response.data
}

type CreateCollectionRequestDto = {
	name: string
}

export const createCollection = (dto: MaybeRefOrGetter<CreateCollectionRequestDto>) => {
	return useApi('post', '/collections', dto)
}

export const createCollectionV2 = async (dto: CreateCollectionRequestDto) => {
	const response = await api.post<{ message: string, collection: Collection }>('/collections', dto)
	return response.data
}

type UpdateCollectionRequestDto = {
	id: number
	name: string
}

export const updateCollection = (dto: MaybeRefOrGetter<UpdateCollectionRequestDto>) => {
	return useApi('put', () => `/collections/${toValue(dto).id}`, dto)
}

export const updateCollectionV2 = async (dto: UpdateCollectionRequestDto) => {
	const response = await api.put<{ message: string, collection: Collection }>(`/collections/${dto.id}`, dto)

	return response.data
}

export const getCollectionRecipes = (id: number | string) => {
	return useApi('get', `/collections/${id}/recipes`, { id })
}

export const deleteCollection = (id: number) => {
	return useApi('delete', `/collections/${id}`, { id })
}
