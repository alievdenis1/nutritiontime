// src/features/WalletBalanceUpdate/api/walletBalanceApi.ts
import useApi from '@/shared/lib/api/use-api'

export interface ClickerStats {
    balance: number;
    energy: number;
    max_energy: number;
    energy_regeneration_rate: number;
    click_reward: number;
    multi_tap_enabled: boolean;
    multi_tap_limit: number;
    click_cooldown: number;
    total_clicks: number;
    total_earned: number;
}

export interface ClickResponse {
    success: boolean;
    earned: number;
    new_balance: number;
    energy: number;
}

export interface EnergyStatus {
    current_energy: number;
    max_energy: number;
    regeneration_rate: number;
    last_update: string;
}

export function getClickerStats() {
    return useApi<ClickerStats>('get', '/clicker/stats')
}

export function getEnergyStatus() {
    return useApi<EnergyStatus>('get', '/clicker/energy')
}

export function processClick(clickCount: number, multiplier: number) {
    return useApi<ClickResponse>('post', '/click', { click_count: clickCount, multiplier })
}
