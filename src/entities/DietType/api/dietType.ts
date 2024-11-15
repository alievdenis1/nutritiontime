import useApi from '@/shared/lib/api/use-api'

type DietDto = {
    id: number;
    name: string;
}

export type DietList = DietDto[]

export function getDietTypeList() {
    return useApi<DietList>('get', '/public/diet-types')
}
