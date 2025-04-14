// src/shared/lib/api/twa.ts
import WebApp from '@twa-dev/sdk'
import { mockTWA } from '@/shared/lib/mock/twa-mock'

export type TWA = typeof WebApp

const isLocal = import.meta.env.VITE_USE_TWA_MOCK
export const twa: TWA | null = isLocal
	? mockTWA
	: (WebApp && 'initDataUnsafe' in WebApp ? WebApp as TWA : null)

if (!twa) {
	console.warn('TWA is not available. Some features may not work correctly.')
}

export default twa