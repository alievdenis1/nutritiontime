import { toUserFriendlyAddress, ConnectedWallet } from '@tonconnect/ui'
import { useWalletStore } from '../../Wallet'
import { getTonConnectUIInstance } from './tonConnectUIInstance'

export function useAuthWalletButton() {
    const isLocal = import.meta.env.VITE_USE_TWA_MOCK

    if (isLocal) {
        return { unsubscribe: () => {
            console.warn('TWA is not available. Some features may not work correctly.')
            }
        }
    }
    const tonConnectUI = getTonConnectUIInstance()
    const unsubscribe = tonConnectUI.onStatusChange((walletInfo: ConnectedWallet | null) => {
        const friendlyWalletAddress = walletInfo?.account.address ?
            toUserFriendlyAddress(walletInfo.account.address) : ''
        const walletStore = useWalletStore()
        walletStore.walletAddress = friendlyWalletAddress
        walletStore.setWalletAddress(friendlyWalletAddress)
        walletStore.setWalletInfo(walletInfo)
        walletStore.setAuthorized(true)
    })

    return { unsubscribe }
}