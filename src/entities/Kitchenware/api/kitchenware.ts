import useApi from '@/shared/lib/api/use-api'

type KitchenwareDto = {
    id: number;
    name: string;
}

export type KitchenwareList = KitchenwareDto[]

type KitchenwareListParams = {
    search?: string;
}

export function getKitchenwareList(params: KitchenwareListParams) {
    return useApi<KitchenwareList>('get', '/public/kitchenware', params)
}
