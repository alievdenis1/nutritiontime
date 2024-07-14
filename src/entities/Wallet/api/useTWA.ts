import WebApp from '@twa-dev/sdk'
import { useWalletStore } from 'entities/Wallet'

export function useTWA() {
    const sessionStore = useWalletStore()
    sessionStore.setUserInfo(WebApp.initDataUnsafe)
    console.log('WebApp.initDataUnsafe', WebApp.initDataUnsafe)
}
