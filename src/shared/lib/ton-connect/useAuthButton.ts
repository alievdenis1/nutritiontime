import { TonConnectUI, toUserFriendlyAddress } from '@tonconnect/ui'
import { useSessionStore } from 'entities/Session'

export function useAuthButton() {
    const tonConnectUI = new TonConnectUI({
        manifestUrl: 'https://alievdenis1.github.io/nutritiolntime/tonconnect-manifest.json',
        buttonRootId: 'ton-connect-button-root',
        language: 'ru'
    })

    const unsubscribe = tonConnectUI.onStatusChange(walletInfo => {
        const sessionStore = useSessionStore()
        if (walletInfo?.account?.address) {
            const friendlyWalletAddress = toUserFriendlyAddress(walletInfo.account.address)
            sessionStore.walletAddress = friendlyWalletAddress
            sessionStore.setWalletAddress(friendlyWalletAddress)
        }
        sessionStore.setWalletInfo(walletInfo)
        sessionStore.setAuthorized(!!walletInfo)
    })

    return { unsubscribe }
}
