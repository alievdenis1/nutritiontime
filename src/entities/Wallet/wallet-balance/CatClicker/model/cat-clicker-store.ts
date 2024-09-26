import { defineStore } from 'pinia'
import { getClickerStats, getEnergyStatus, processClick } from '@/features/WalletBalanceUpdate/api/walletBalanceApi'

interface Notification {
    message: string;
    type: 'error' | 'success';
    id: number;
}
interface CatClickerState {
    currency: number;
    energyCurrent: number;
    maxEnergy: number;
    energyRegenerationRate: number;
    clickReward: number;
    multiTapEnabled: boolean;
    multiTapLimit: number;
    clickCooldown: number;
    totalClicks: number;
    totalEarned: number;
    isRapidClicking: boolean;
    isShouting: boolean;
    isShaking: boolean;
    clickBuffer: number;
    lastSyncTime: number;
    isSyncing: boolean;
    notifications: Notification[];
    shakeClicks: number;
    shoutClicks: number;
    shakeClickBuffer: number;
    shoutClickBuffer: number;
    lastMultiClickTime: number;
    pendingRewards: number;
    syncInterval: number;
    shoutLevel: 'low' | 'medium' | 'high';
    shakeLevel: 'low' | 'medium' | 'high';
}
export const useCatClickerStore = defineStore('catClicker', {
    state: (): CatClickerState => ({
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
        clickBuffer: 0,
        lastSyncTime: Date.now(),
        isSyncing: false,
        shakeClicks: 0,
        shoutClicks: 0,
        isShaking: false,
        isShouting: false,
        notifications: [],
        shakeClickBuffer: 0,
        shoutClickBuffer: 0,
        lastMultiClickTime: 0,
        pendingRewards: 0,
        syncInterval: 500, // Интерв
        shoutLevel: 'low',
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
                this.addNotification('Failed to fetch clicker stats', 'error')
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
                this.addNotification('Failed to fetch energy status', 'error')
            }
        },
        click(clickCount = 1) {
            if (this.energyCurrent < clickCount) {
                console.log('Недостаточно энергии')
                return false
            }

            // Обновляем локальное состояние
            this.clickBuffer += clickCount
            this.energyCurrent -= clickCount
            this.totalClicks += clickCount

            // Оптимистичное обновление UI
            const estimatedReward = this.clickReward * clickCount
            this.pendingRewards += estimatedReward
            this.currency += estimatedReward

            // Учитываем клики во время тряски или крика
            if (this.isShaking) {
                this.shakeClickBuffer += clickCount
            }
            if (this.isShouting) {
                this.shoutClickBuffer += clickCount
            }

            // Проверяем, нужно ли синхронизироваться с сервером
            const now = Date.now()
            if (this.clickBuffer >= 10 || now - this.lastSyncTime > this.syncInterval) {
                this.syncWithServer()
            }

            return true
        },
        async syncWithServer() {
            if (this.isSyncing || this.clickBuffer === 0) return

            this.isSyncing = true
            const clicksToSync = this.clickBuffer
            const shakeClicksToSync = this.shakeClickBuffer
            const shoutClicksToSync = this.shoutClickBuffer
            this.clickBuffer = 0
            this.shakeClickBuffer = 0
            this.shoutClickBuffer = 0

            try {
                const { data, error, execute } = processClick({
                    energy_spent: clicksToSync,
                    is_multi_click: false,
                    shake_clicks: shakeClicksToSync,
                    shout_clicks: shoutClicksToSync
                })
                await execute()

                if (data.value) {
                    const newBalance = typeof data.value.new_balance === 'string'
                        ? parseFloat(data.value.new_balance)
                        : data.value.new_balance

                    // Корректируем баланс на основе фактического результата
                    const actualReward = newBalance - (this.currency - this.pendingRewards)
                    this.currency = newBalance
                    this.energyCurrent = data.value.energy
                    this.totalEarned = data.value.total_earned
                    this.pendingRewards = 0

                    if (Math.abs(actualReward - this.pendingRewards) > 0.01) {
                        console.log('Расхождение между ожидаемой и фактической наградой:',
                            this.pendingRewards - actualReward)
                    }
                } else if (error.value) {
                    console.error('Failed to sync clicks:', error.value)
                    this.addNotification('Failed to sync clicks', 'error')
                    // Возвращаем клики в буфер в случае ошибки
                    this.clickBuffer += clicksToSync
                    this.shakeClickBuffer += shakeClicksToSync
                    this.shoutClickBuffer += shoutClicksToSync
                    // Отменяем оптимистичное обновление
                    this.currency -= this.pendingRewards
                    this.pendingRewards = 0
                }
            } catch (error) {
                console.error('Error in syncWithServer:', error)
                this.addNotification('Error syncing with server', 'error')
                // Возвращаем клики в буфер в случае ошибки
                this.clickBuffer += clicksToSync
                this.shakeClickBuffer += shakeClicksToSync
                this.shoutClickBuffer += shoutClicksToSync
                // Отменяем оптимистичное обновление
                this.currency -= this.pendingRewards
                this.pendingRewards = 0
            } finally {
                this.isSyncing = false
                this.lastSyncTime = Date.now()
            }
        },
        startPeriodicSync() {
            setInterval(() => {
                if (this.clickBuffer > 0) {
                    this.syncWithServer()
                }
            }, this.syncInterval)
        },
        addNotification(message: string, type: 'error' | 'success' = 'error') {
            const notification: Notification = { message, type, id: Date.now() }
            this.notifications.push(notification)
            setTimeout(() => this.removeNotification(notification.id), 5000)
        },
        removeNotification(id: number) {
            this.notifications = this.notifications.filter(n => n.id !== id)
        },
        setShaking(value: boolean) {
            this.isShaking = value
        },
        setShouting(value: boolean) {
            this.isShouting = value
        },
        setRapidClicking(value: boolean) {
            this.isRapidClicking = value
        },
        setCurrency(value: number) {
            this.currency = value
        },
        setEnergyCurrent(value: number) {
            this.energyCurrent = value
        },
    },
})
