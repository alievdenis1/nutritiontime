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
        clickBuffer: 0,
        lastSyncTime: Date.now(),
        isSyncing: false,
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
            } else if (error.value) {
                console.error('Failed to fetch energy status:', error.value)
            }
        },
        async click(clickCount = 1) {
            if (this.energyCurrent < clickCount) {
                console.log('Not enough energy')
                return
            }

            // Обновляем локальное состояние
            this.clickBuffer += clickCount
            this.energyCurrent -= clickCount
            this.currency += this.clickReward * clickCount
            this.totalClicks += clickCount
            this.totalEarned += this.clickReward * clickCount

            // Проверяем, нужно ли синхронизироваться с сервером
            if (this.clickBuffer >= 10 || Date.now() - this.lastSyncTime > 3000) {
                await this.syncWithServer()
            }
        },
        async syncWithServer() {
            if (this.isSyncing || this.clickBuffer === 0) return

            this.isSyncing = true
            const clicksToSync = this.clickBuffer
            this.clickBuffer = 0

            try {
                const { data, error, execute } = processClick(clicksToSync, 1) // предполагаем, что multiplier всегда 1
                await execute()

                if (data.value) {
                    // Обновляем состояние данными с сервера
                    this.currency = data.value.new_balance
                    this.energyCurrent = data.value.energy
                    // Возможно, нужно обновить и другие поля
                } else if (error.value) {
                    console.error('Failed to sync clicks:', error.value)
                    // Возвращаем клики в буфер в случае ошибки
                    this.clickBuffer += clicksToSync
                }
            } finally {
                this.isSyncing = false
                this.lastSyncTime = Date.now()
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
