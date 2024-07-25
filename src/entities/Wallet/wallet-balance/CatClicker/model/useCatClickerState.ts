import { ref, computed } from 'vue'

export function useCatClickerState() {
    const currency = ref(0)
    const energyCurrent = ref(100)
    const isRapidClicking = ref(false)
    const isShouting = ref(false)
    const isShaking = ref(false)
    const isCalibrating = ref(true)
    const isAudioInitialized = ref(false)
    const errorMessage = ref('')
    const normalizedAverage = ref(0)
    const relativeIncrease = ref(0)
    const currentLevel = ref(0)
    const baselineNoiseLevel = ref(0)
    const noiseLevels = ref<number[]>([])
    const testCounter = ref(0)
    const testCounter2 = ref(0)
    const testCounter3 = ref(0)
    const testCounter4 = ref(0)
    const forceUpdate = ref(0)

    const isEnergyAvailable = computed(() => energyCurrent.value > 0)

    return {
        currency,
        energyCurrent,
        isRapidClicking,
        isShouting,
        isShaking,
        isCalibrating,
        isAudioInitialized,
        errorMessage,
        normalizedAverage,
        relativeIncrease,
        currentLevel,
        baselineNoiseLevel,
        noiseLevels,
        testCounter,
        testCounter2,
        testCounter3,
        testCounter4,
        forceUpdate,
        isEnergyAvailable
    }
}