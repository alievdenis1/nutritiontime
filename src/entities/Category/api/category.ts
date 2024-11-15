import useApi from '@/shared/lib/api/use-api'

type CategoryDto = {
    id: number;
    name: string;
}

export type CategoryList = CategoryDto[]

export function getCategoryList() {
    return useApi<CategoryList>('get', '/public/categories')
}
