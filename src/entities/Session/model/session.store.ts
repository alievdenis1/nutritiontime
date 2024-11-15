import { defineStore } from 'pinia'
import type { User } from '../types'
import type { Locales } from '@/shared/lib/i18n/types.ts'

type State = {
	userInfo: User | null,
	error: string | null,
	token: string | null,
	isAuthenticated: boolean,
	lang: Locales,
};

export const useSessionStore = defineStore({
	id: 'session-store',
	state: (): State => ({
		userInfo: null,
		error: null,
		token: null,
		isAuthenticated: false,
		lang: 'ru',
	}),
	getters: {
		isAuthenticated(): boolean {
			return this.token !== null
		},
	},
	actions: {
		updateToken(newToken: string | null) {
			this.token = newToken
			if (newToken === null) {
				localStorage.removeItem('auth_token')
			} else {
				localStorage.setItem('auth_token', newToken)
			}
		},
		setError(errorMessage: string) {
			this.error = errorMessage
		},
		setUserInfo(userInfo: User | null) {
			this.userInfo = userInfo
		},
		setLang(lang: Locales) {
			this.lang = lang
		},
	}
})
