import WebApp from '@twa-dev/sdk'
import { useSessionStore } from 'entities/Session'

export function useTWA() {
    const sessionStore = useSessionStore()
    sessionStore.setUserInfo(WebApp.initDataUnsafe)
    console.log('WebApp.initDataUnsafe', WebApp.initDataUnsafe)
}
