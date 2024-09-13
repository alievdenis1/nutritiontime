import { TonConnectUI } from '@tonconnect/ui'

let instance: TonConnectUI | null = null
const isLocal = import.meta.env.VITE_USE_TWA_MOCK

export function getTonConnectUIInstance(): TonConnectUI {
    if (isLocal) {
        console.warn('TWA is not available. Some features may not work correctly.')
    }
    if (!instance) {
        instance = new TonConnectUI({
            manifestUrl: 'https://alievdenis1.github.io/nutritiolntime/tonconnect-manifest.json',
            buttonRootId: 'ton-connect-button-root',
            language: 'ru'
        })
    }
    return instance
}