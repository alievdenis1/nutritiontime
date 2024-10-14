// src/api/auth.ts
import useApi from '@/shared/lib/api/use-api'
import type { User } from '@/entities/Session/types'

export interface LoginResponse {
	user: User;
	token: string;
}
interface LoginData {
	telegram_id: string
	first_name: string
	last_name: string
	referral_code?: string | null
}

export function login(data: LoginData) {
	return useApi<LoginResponse>('post', '/login', data)
}

export function getProfile() {
	return useApi<LoginResponse>('get', '/profile/me')
}