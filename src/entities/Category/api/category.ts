import { api } from '@/shared/lib/api/use-api'

type CategoryDto = {
    id: number;
    name: string;
}

export async function getCategoryList() {
    const response = await api.get<CategoryDto[]>('/public/categories')
    return response.data
}
