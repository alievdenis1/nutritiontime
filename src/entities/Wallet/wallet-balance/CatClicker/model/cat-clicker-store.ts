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
        userId: 0,
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
        connectSocket() {
            const userId = this.userId
            if (!userId) return

            window.Echo.private(`user.${userId}`)
                .listen('UserStatsUpdated', (data: any) => {
                    this.currency = data.balance
                    this.energyCurrent = data.energy
                    this.maxEnergy = data.max_energy
                    this.totalClicks = data.total_clicks
                    this.totalEarned = data.total_earned
                    // Обновите другие поля по необходимости
                })
        },
        async click(clickCount = 1) {
            if (this.energyCurrent < clickCount) {
                console.log('Not enough energy')
                return
            }

            this.energyCurrent -= clickCount

            const multiplier = 1
            try {
                const { data, error, execute } =
                    processClick(clickCount, multiplier)
                await execute()

                if (data.value) {
                    // Остальные данные обновятся через WebSocket
                } else if (error.value) {
                    console.error('Failed to process click:', error.value)
                }
            } catch (e) {
                console.error('Error processing click:', e)
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
