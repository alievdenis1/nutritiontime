import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getClickerStats, getEnergyStatus, processClick, ClickerStats, EnergyStatus, ClickResponse, ClickRequest } from '@/features/WalletBalanceUpdate/api/walletBalanceApi'

export const useCatClickerStore = defineStore('catClicker', () => {
    const stats = ref<ClickerStats | null>(null)
    const energyStatus = ref<EnergyStatus | null>(null)
    const pendingClicks = ref<{ energy_spent: number, shake_clicks: number, shout_clicks: number }[]>([])
    const lastSyncTime = ref(Date.now())
    const syncInterval = 1700 // 5 seconds
    const localVersion = ref(0)
    const serverVersion = ref(0)

    const currency = computed(() => Number(stats.value?.balance ?? 0).toFixed(2))
    const energyCurrent = computed(() => Number(energyStatus.value?.current_energy ?? 0).toFixed(2))
    const energyMax = computed(() => Number(energyStatus.value?.max_energy ?? 100).toFixed(2))
    const canClick = computed(() => Number(energyCurrent.value) > 0)

    const isShaking = ref(false)
    const isShouting = ref(false)
    const isRapidClicking = ref(false)

    function setShaking(value: boolean) {
        isShaking.value = value
    }
    function setShouting(value: boolean) {
        isShouting.value = value
    }
    function setRapidClicking(value: boolean) {
        isRapidClicking.value = value
    }

    async function fetchStats() {
        const { data, error, execute } = getClickerStats()
        await execute()
        if (data.value && !error.value) {
            mergeStats(data.value)
        }
    }

    async function fetchEnergyStatus() {
        const { data, error, execute } = getEnergyStatus()
        await execute()
        if (data.value && !error.value) {
            mergeEnergyStatus(data.value)
        }
    }

    function mergeStats(serverStats: ClickerStats) {
        stats.value = {
            ...serverStats,
            balance: Number(serverStats.balance),
            energy: Number(serverStats.energy),
            max_energy: Number(serverStats.max_energy),
            energy_regeneration_rate: Number(serverStats.energy_regeneration_rate),
            click_reward: Number(serverStats.click_reward),
            total_clicks: Number(serverStats.total_clicks),
            total_earned: Number(serverStats.total_earned)
        }
        serverVersion.value++
        localVersion.value = serverVersion.value
    }

    function mergeEnergyStatus(serverEnergyStatus: EnergyStatus) {
        energyStatus.value = {
            current_energy: Number(serverEnergyStatus.current_energy),
            max_energy: Number(serverEnergyStatus.max_energy),
            regeneration_rate: Number(serverEnergyStatus.regeneration_rate),
            last_update: serverEnergyStatus.last_update
        }
        serverVersion.value++
        localVersion.value = serverVersion.value
    }

    async function syncWithBackend() {
        const now = Date.now()
        if (now - lastSyncTime.value < syncInterval) return

        if (pendingClicks.value.length > 0) {
            const totalEnergySpent = pendingClicks.value.reduce((sum, click) => sum + click.energy_spent, 0)
            const totalShakeClicks = pendingClicks.value.reduce((sum, click) => sum + click.shake_clicks, 0)
            const totalShoutClicks = pendingClicks.value.reduce((sum, click) => sum + click.shout_clicks, 0)

            const clickRequest: ClickRequest = {
                energy_spent: totalEnergySpent,
                is_multi_click: false,
                shake_clicks: totalShakeClicks,
                shout_clicks: totalShoutClicks
            }

            const { data, error, execute } = processClick(clickRequest)
            await execute()

            if (data.value && !error.value) {
                updateStatsFromClickResponse(data.value)
                pendingClicks.value = []
                localVersion.value++
            } else {
                console.error('Error processing clicks:', error.value)
            }
        }

        await Promise.all([fetchStats(), fetchEnergyStatus()])
        lastSyncTime.value = now
    }

    function updateStatsFromClickResponse(response: ClickResponse) {
        if (stats.value) {
            stats.value.balance = Number(response.new_balance)
            stats.value.total_earned = Number(response.total_earned)
        }

        if (energyStatus.value) {
            energyStatus.value.current_energy = Number(response.current_energy)
        }

        localVersion.value++
    }

    function click(energySpent = 1, shakeClicks = 0, shoutClicks = 0) {
        if (!canClick.value) return false

        pendingClicks.value.push({ energy_spent: energySpent, shake_clicks: shakeClicks, shout_clicks: shoutClicks })

        // Оптимистичное обновление
        if (energyStatus.value) {
            energyStatus.value.current_energy = Math.max(0, Number(energyStatus.value.current_energy) - energySpent)
        }
        if (stats.value) {
            const reward = Number(stats.value.click_reward) * energySpent
            stats.value.balance = Number(stats.value.balance) + reward
            stats.value.total_clicks++
            stats.value.total_earned = Number(stats.value.total_earned) + reward
        }
        localVersion.value++

        return true
    }

    // Инициализация и периодическая синхронизация
    fetchStats()
    fetchEnergyStatus()
    setInterval(syncWithBackend, syncInterval)

    return {
        stats,
        energyStatus,
        currency,
        energyCurrent,
        energyMax,
        canClick,
        click,
        syncWithBackend,
        setShaking,
        setShouting,
        setRapidClicking,
        isShaking,
        isShouting,
        isRapidClicking
    }
})