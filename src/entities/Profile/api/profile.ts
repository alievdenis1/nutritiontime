import useApi from '@/shared/lib/api/use-api'
import type { ProfileResponse, MealStats, Notification, StatisticsResponse } from '../model'

export function getStatistics(period = 'week') {
 return useApi<StatisticsResponse>('get', '/my-stats', { period })
}
interface GetMealsParams {
 start_date?: string;
 end_date?: string;
}

export function getProfile() {
 return useApi<ProfileResponse>('get', '/profile')
}

export function getMealStats(params?: GetMealsParams) {
 return useApi<MealStats>('get', '/meals/stats', params)
}

export function getNotifications() {
 return useApi<Notification[]>('get', '/notifications')
}

export function deleteMeal(mealId: number) {
 return useApi<{ message: string }>('delete', `/meals/${mealId}`)
}