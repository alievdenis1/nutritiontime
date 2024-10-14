// src/api/auth.ts
import useApi from '@/shared/lib/api/use-api'

import { ILeader, IWalletHistory } from '../types'

export function getLeaderboard() {
 return useApi<ILeader>('get', '/leaderboard')
}

export function getWalletHistory() {
 return useApi<IWalletHistory>('get', '/wallet/history')
}
