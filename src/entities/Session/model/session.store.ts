import { defineStore } from 'pinia'
import type { User } from '../types'

type State = {
	userInfo: User | null,
	error: string | null,
	token: string | null,
	isAuthenticated: boolean,
};

export const useSessionStore = defineStore({
	id: 'session-store',
	state: (): State => ({
		userInfo: null,
		error: null,
		token: null,
		isAuthenticated: false,
	}),
	getters: {
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
		}
	}
})
