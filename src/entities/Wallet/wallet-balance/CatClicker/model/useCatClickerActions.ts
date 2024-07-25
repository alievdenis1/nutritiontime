import { useCatClickerState } from './useCatClickerState'

export function useCatClickerActions() {
    const state = useCatClickerState()

    const addCurrency = (amount: number) => {
        state.currency.value += amount
    }

    const useEnergy = () => {
        if (state.energyCurrent.value > 0) {
            state.energyCurrent.value--
        }
    }

    const setRapidClicking = (value: boolean) => {
        state.isRapidClicking.value = value
    }

    const setShouting = (value: boolean) => {
        state.isShouting.value = value
    }

    const setShaking = (value: boolean) => {
        state.isShaking.value = value
    }

    const updateNoiseLevel = (level: number) => {
        state.noiseLevels.value.push(level)
        if (state.noiseLevels.value.length > 800) {
            state.noiseLevels.value.shift()
        }
        state.baselineNoiseLevel.value = state.noiseLevels.value.reduce((sum, level) => sum + level, 0) / state.noiseLevels.value.length
    }

    return {
        addCurrency,
        useEnergy,
        setRapidClicking,
        setShouting,
        setShaking,
        updateNoiseLevel
    }
}