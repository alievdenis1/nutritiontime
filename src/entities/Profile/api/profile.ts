import useApi from '@/shared/lib/api/use-api'
import type { ProfileResponse, MealStats, Notification, StatisticsResponse } from '../model'

export function getStatistics(period = 'week') {
 return useApi<StatisticsResponse>('get', '/my-stats', { period })
}
interface GetMealsParams {
 start_date?: string;
 end_date?: string;
}

export interface WeightLogData {
 id?: number
 weight: number
 notes?: string
 date?: string
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

export const logWeight = (data: WeightLogData) => {
 return useApi<WeightLogData>('post', '/weight/log', data)
}

export const updateWeight = (logId: number, data: WeightLogData) => {
 return useApi<WeightLogData>('put', `/weight/log/${logId}`, data)
}

export function sendToSubscription() {
 return useApi('get', '/subscription')
}

export function sendToProfile() {
 return useApi('get', '/subscription')
}

export function sendToAddMeal() {
 return useApi('get', '/subscription')
}
