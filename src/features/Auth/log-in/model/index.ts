import { useSessionStore } from '@/entities/Session/model'
import { login } from '../api'
import { ref } from 'vue'
import { twa } from '@/shared/lib/api/twa'
import type { Locales } from '@/shared/lib/i18n/types.ts'

export const useAuthorization = () => {
    const sessionStore = useSessionStore()
    const isLoading = ref<boolean>(false)

    const processStartParam = (startParam: string | null): {
        referralCode: string | null,
        paymentMonths: string | null,
        statisticsTab: boolean
    } => {
        if (!startParam) return {
            referralCode: null,
            paymentMonths: null,
            statisticsTab: false
        }

        if (startParam.startsWith('payment_')) {
            const months = startParam.replace('payment_', '')
            return {
                referralCode: null,
                paymentMonths: ['1', '3', '12'].includes(months) ? months : null,
                statisticsTab: false
            }
        }

        if (startParam === 'statistics') {
            return {
                referralCode: null,
                paymentMonths: null,
                statisticsTab: true
            }
        }

        return {
            referralCode: startParam,
            paymentMonths: null,
            statisticsTab: false
        }
    }
    const authorize = async () => {
        if (!twa) {
            console.error('TWA is not available')
            sessionStore.setError('TWA is not available')
            return
        }

        isLoading.value = true
        try {
            const twaUser = twa.initDataUnsafe.user

            if (!twaUser) {
                throw new Error('User data is not available from TWA')
            }

            if (twaUser.language_code != undefined) {
                sessionStore.setLang(twaUser.language_code as Locales)
            }

            const startParam = twa.initDataUnsafe?.start_param ?? null
            const { referralCode } = processStartParam(startParam)

            const { data, error: loginError, execute } = login({
                telegram_id: twaUser.id.toString(),
                first_name: twaUser.first_name,
                last_name: twaUser.last_name || '',
                referral_code: referralCode,
            })

            await execute()

            if (loginError.value) {
                console.error('Login error:', loginError.value)
                throw new Error(loginError.value)
            }

            if (!data.value) {
                console.error('No data received from login')
                throw new Error('Failed to login')
            }

            console.log('Received login data:', data.value)

            const { user: userData, token: newToken } = data.value

            sessionStore.updateToken(newToken)
            sessionStore.setUserInfo(userData)
        } catch (e) {
            console.error('Error during session initialization:', e)
            sessionStore.setError(e instanceof Error ? e.message : String(e))
            sessionStore.setUserInfo(null)
            sessionStore.updateToken(null)
        } finally {
            isLoading.value = false
        }

        return Promise.resolve()
    }

    return {
        isLoading,
        authorize
    }
}
