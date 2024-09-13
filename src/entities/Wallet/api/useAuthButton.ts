import { toUserFriendlyAddress, ConnectedWallet } from '@tonconnect/ui'
import { useWalletStore } from '../../Wallet'
import { getTonConnectUIInstance } from './tonConnectUIInstance'

export function useAuthButton() {
    const tonConnectUI = getTonConnectUIInstance()
    console.log(tonConnectUI.connectionRestored)
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