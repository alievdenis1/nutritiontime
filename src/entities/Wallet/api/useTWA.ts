import WebApp from '@twa-dev/sdk'
import { useSessionStore } from 'entities/Wallet'

export function useTWA() {
    const sessionStore = useSessionStore()
    sessionStore.setUserInfo(WebApp.initDataUnsafe)
    console.log('WebApp.initDataUnsafe', WebApp.initDataUnsafe)
}
