// src/entities/Wallet/wallet-balance/CatClicker/model/cat-clicker-store.ts
import { defineStore } from 'pinia'
import { getClickerStats, getEnergyStatus, processClick } from '@/features/WalletBalanceUpdate/api/walletBalanceApi'

export const useCatClickerStore = defineStore('catClicker', {
    state: () => ({
        currency: 0,
        energyCurrent: 100,
        maxEnergy: 100,
        energyRegenerationRate: 1,
        clickReward: 1.5,
        multiTapEnabled: false,
        multiTapLimit: 1,
        clickCooldown: 1000,
        totalClicks: 0,
        totalEarned: 0,
        isRapidClicking: false,
        isShouting: false,
        shoutLevel: 'low',
        isShaking: false,
        shakeLevel: 'medium',
    }),
    actions: {
        async fetchClickerStats() {
            const { data, error, execute } = getClickerStats()
            await execute()
            if (data.value) {
                const stats = data.value
                this.currency = stats.balance
                this.energyCurrent = stats.energy
                this.maxEnergy = stats.max_energy
                this.energyRegenerationRate = stats.energy_regeneration_rate
                this.clickReward = stats.click_reward
                this.multiTapEnabled = stats.multi_tap_enabled
                this.multiTapLimit = stats.multi_tap_limit
                this.clickCooldown = stats.click_cooldown
                this.totalClicks = stats.total_clicks
                this.totalEarned = stats.total_earned
            } else if (error.value) {
                console.error('Failed to fetch clicker stats:', error.value)
            }
        },
        async fetchEnergyStatus() {
            const { data, error, execute } = getEnergyStatus()
            await execute()
            if (data.value) {
                const energy = data.value
                this.energyCurrent = energy.current_energy
                this.maxEnergy = energy.max_energy
                this.energyRegenerationRate = energy.regeneration_rate
                // Здесь можно обработать last_update при необходимости
            } else if (error.value) {
                console.error('Failed to fetch energy status:', error.value)
            }
        },
        async processClick(clickCount: number, multiplier: number) {
            const { data, error, execute } = processClick(clickCount, multiplier)
            await execute()
            if (data.value) {
                this.currency = data.value.new_balance
                this.energyCurrent = data.value.energy
                this.totalClicks += clickCount
                this.totalEarned += data.value.earned
            } else if (error.value) {
                console.error('Failed to process click:', error.value)
            }
        },
        // Остальные методы
        setRapidClicking(value: boolean) {
            this.isRapidClicking = value
        },
        setShouting(value: boolean) {
            this.isShouting = value
        },
        setShaking(value: boolean) {
            this.isShaking = value
        },
        setShakeLevel(level: string) {
            this.shakeLevel = level
        },
        setShoutLevel(level: string) {
            this.shoutLevel = level
        },
        setCurrency(value: number) {
            this.currency = value
        },
        setEnergyCurrent(value: number) {
            this.energyCurrent = value
        },
    },
})
