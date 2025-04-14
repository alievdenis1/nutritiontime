// src/api/auth.ts
import useApi from '@/shared/lib/api/use-api'
import type { User } from '@/entities/Session/types'
import WebApp from '@twa-dev/sdk'
type TWAInitData = typeof WebApp.initData

export interface LoginResponse {
	user: User;
	token: string;
}
interface LoginData {
	initData: TWAInitData
	telegram_id: string
	first_name: string
	last_name: string
	referral_code?: string | null
}

export function login(data: LoginData) {
	console.log('LoginData')
	console.log(data)
	return useApi<LoginResponse>('post', '/login', data)
}

export function getProfile() {
	return useApi<LoginResponse>('get', '/profile/me')
}