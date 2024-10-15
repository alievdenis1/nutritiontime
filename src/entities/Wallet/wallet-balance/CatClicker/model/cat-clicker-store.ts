import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getClickerStats, getEnergyStatus, processClick, ClickerStats, EnergyStatus, ClickResponse, ClickRequest } from '@/features/WalletBalanceUpdate/api/walletBalanceApi'

const ConfigClicker = {
    defaultEnergyRegenerationRate: 1,
    defaultMaxEnergy: 500,
}

const getTimestampWithTimezoneOffset = () => {
    const timestampOffset = new Date().getTimezoneOffset() * 60 * 1000
    const timestamp = Date.now() + timestampOffset

    return timestamp
}

export const useCatClickerStore = defineStore('catClicker', () => {
    const stats = ref<ClickerStats | null>(null)
    const energyStatus = ref<EnergyStatus | null>(null)
    const lastEnergyUpdateTimestamp = ref<number>()
    const pendingClicks = ref<{ energy_spent: number, is_multi_click: boolean, shake_clicks: number, shout_clicks: number }[]>([])
    const lastSyncTime = ref(Date.now())
    const syncInterval = 2000
    const localVersion = ref(0)
    const serverVersion = ref(0)

    const currency = computed(() => Number(stats.value?.balance ?? 0).toFixed(2))
    const energyCurrent = computed(() => Number(energyStatus.value?.current_energy ?? 0).toFixed(2))
    const energyMax = computed(() => Number(energyStatus.value?.max_energy ?? 100).toFixed(2))
    const canClick = computed(() => Number(energyCurrent.value) >= 1)

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

    function click(energySpent = 1, isMultiClick = false, shakeClicks = 0, shoutClicks = 0) {
        if (!canClick.value) return false

        pendingClicks.value.push({ energy_spent: energySpent, is_multi_click: isMultiClick, shake_clicks: shakeClicks, shout_clicks: shoutClicks })

        // Оптимистичное обновление
        if (energyStatus.value) {
            energyStatus.value.current_energy = Math.max(0, Number(energyStatus.value.current_energy) - energySpent)
        }
        if (stats.value) {
            // TODO: эту логику можно вынести отдельно, чтобы в при ошибке можно было посчитать сколько
            // было потрачено энергии и накоплено монет
            // TODO: TESTING
            const normalClicks = energySpent - shakeClicks - shoutClicks
            const baseReward = normalClicks * 0.01
            const shakeMultiplier = (shakeClicks * 0.01) * 2 // Пример: 1% бонус за каждую тряску
            const shoutMultiplier = (shoutClicks * 0.01) * 4// Пример: 2% бонус за каждый крик
            // const baseReward = Number(stats.value.click_reward) * energySpent
            // const shakeMultiplier = 1 + (shakeClicks * 0.01) // Пример: 1% бонус за каждую тряску
            // const shoutMultiplier = 1 + (shoutClicks * 0.02) // Пример: 2% бонус за каждый крик

            // const totalReward = baseReward * shakeMultiplier * shoutMultiplier
            const totalReward = baseReward + shakeMultiplier + shoutMultiplier
            console.log('totalReward', totalReward)
            stats.value.balance = Number(stats.value.balance) + totalReward
            stats.value.total_clicks++
            stats.value.total_earned = Number(stats.value.total_earned) + totalReward
        }
        localVersion.value++

        return true
    }

    async function syncWithBackend() {
        const now = Date.now()
        if (now - lastSyncTime.value < syncInterval) return

        if (pendingClicks.value.length > 0) {
            const totalEnergySpent = pendingClicks.value.reduce((sum, click) => sum + click.energy_spent, 0)
            const totalShakeClicks = pendingClicks.value.reduce((sum, click) => sum + click.shake_clicks, 0)
            const totalShoutClicks = pendingClicks.value.reduce((sum, click) => sum + click.shout_clicks, 0)
            const isMultiClick = pendingClicks.value[0].is_multi_click // Берем значение из первого клика

            const clickRequest: ClickRequest = {
                energy_spent: totalEnergySpent,
                is_multi_click: isMultiClick,
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
                // TODO: на основе логики из функции click
                // можно рассчитать сколько мы потратили энергии и заработали монет
                // и это значение вычесть и отобразить ошибку (что что-то пошло не так)
                console.error('Error processing clicks:', error.value)
                pendingClicks.value = []
                localVersion.value++
            }
        }

        lastSyncTime.value = now
    }

    async function initialStatsRequest() {
        await Promise.allSettled([fetchStats(), fetchEnergyStatus()])
    }

    function regenerateEnergy() {
        if (!energyStatus.value?.last_update) return

        const user = {
            lastUpdateTimestamp: new Date(lastEnergyUpdateTimestamp.value || energyStatus.value.last_update).valueOf(),
            lastEnergyUpdate: energyStatus.value.last_update,
            energyRegenerationRate: energyStatus.value?.regeneration_rate || 1,
            energy: energyStatus.value?.current_energy || 0,
        }

        const now = getTimestampWithTimezoneOffset()

        const currentTimestamp = now
        const lastUpdateTimestamp = user.lastUpdateTimestamp
        const secondsPassed = Math.max(0, (currentTimestamp - lastUpdateTimestamp) / 1000)
        const minutesPassed = secondsPassed / 60

        const regenerationRate = user.energyRegenerationRate ?? ConfigClicker.defaultEnergyRegenerationRate

        if (regenerationRate <= 0) {
            return
        }

        const currentEnergy = user.energy

        if (currentEnergy >= ConfigClicker.defaultMaxEnergy) {
            return
        }

        const regeneratedEnergy = minutesPassed * regenerationRate
        const minRegenerationThreshold = 0.01

        if (regeneratedEnergy >= minRegenerationThreshold) {
            const newEnergy = Math.min(ConfigClicker.defaultMaxEnergy, currentEnergy + regeneratedEnergy)

            user.energy = newEnergy
            user.lastEnergyUpdate = new Date(now).toString()

            energyStatus.value = {
                ...energyStatus.value,
                last_update: user.lastEnergyUpdate,
                regeneration_rate: user.energyRegenerationRate,
                current_energy: user.energy
            }

            lastEnergyUpdateTimestamp.value = now
        }
    }

    function resetLastEnergyUpdateTimestamp() {
        lastEnergyUpdateTimestamp.value = 0
    }

    return {
        stats,
        energyStatus,
        currency,
        energyCurrent,
        energyMax,
        canClick,
        syncInterval,
        click,
        syncWithBackend,
        initialStatsRequest,
        setShaking,
        setShouting,
        setRapidClicking,
        regenerateEnergy,
        resetLastEnergyUpdateTimestamp,
        isShaking,
        isShouting,
        isRapidClicking
    }
})
