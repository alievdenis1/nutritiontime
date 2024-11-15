import useApi from '@/shared/lib/api/use-api'

type CuisineDto = {
    id: number;
    name: string;
}

export type CuisineList = CuisineDto[]

export function getCuisineList() {
    return useApi<CuisineList>('get', '/public/cuisines')
}
