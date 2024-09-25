import { ref, computed } from 'vue'
import { useCatClickerStore, CLICKER_CONFIG } from 'entities/Wallet/wallet-balance/CatClicker'

export const useAudioAnalysis = () => {
    const store = useCatClickerStore()

    const CALIBRATION_DURATION = 3000
    const NOISE_SAMPLES = 50
    const SMOOTHING_FACTOR = 3.2

    const isCalibrating = ref(true)
    const isAudioInitialized = ref(false)
    const errorMessage = ref('')
    const baselineNoiseLevel = ref(0)
    const noiseLevels = ref<number[]>([])
    const currentAudioLevel = ref(0)
    const smoothedAudioLevel = ref(0)

    let audioContext: AudioContext | null = null
    let analyser: AnalyserNode | null = null
    let microphone: MediaStreamAudioSourceNode | null = null

    const isWebAudioSupported = 'AudioContext' in window || 'webkitAudioContext' in window

    const startAudioAnalysis = async () => {
        if (isAudioInitialized.value) return

        if (!isWebAudioSupported) {
            console.log('Web Audio API is not supported. Using alternative method.')
            return
        }

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
            audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
            analyser = audioContext.createAnalyser()
            microphone = audioContext.createMediaStreamSource(stream)
            microphone.connect(analyser)
            analyser.fftSize = 1024
            const bufferLength = analyser.frequencyBinCount
            const dataArray = new Uint8Array(bufferLength)

            const calibrationStartTime = Date.now()

            const getAudioLevel = (): number => {
                analyser!.getByteFrequencyData(dataArray)
                return Math.max(...dataArray) / 255
            }

            const updateNoiseLevel = (level: number) => {
                noiseLevels.value.push(level)
                if (noiseLevels.value.length > NOISE_SAMPLES) {
                    noiseLevels.value.shift()
                }

                baselineNoiseLevel.value = noiseLevels.value.reduce((sum, level) => sum + level, 0) / noiseLevels.value.length
            }
            const checkAudioLevel = () => {
                const rawLevel = getAudioLevel()
                currentAudioLevel.value = rawLevel

                if (Date.now() - calibrationStartTime < CALIBRATION_DURATION) {
                    updateNoiseLevel(rawLevel)
                } else {
                    if (isCalibrating.value) {
                        isCalibrating.value = false
                        // console.log('Calibration complete. Baseline noise level:', baselineNoiseLevel.value)
                    }

                    smoothedAudioLevel.value = smoothedAudioLevel.value * (4 - SMOOTHING_FACTOR) + rawLevel * SMOOTHING_FACTOR

                    const normalizedLevel = Math.max(0, Math.min(5, (smoothedAudioLevel.value - baselineNoiseLevel.value) / (4 - baselineNoiseLevel.value)))

                    let shoutLevel = ''
                    if (normalizedLevel > CLICKER_CONFIG.sound.thresholdLow) {
                        shoutLevel = store.shoutLevel
                    }

                    if (shoutLevel) {
                        // console.log(`Shouting detected! Level: ${shoutLevel}, Normalized level: ${normalizedLevel.toFixed(2)}`)
                        store.setShouting(true)
                    } else {
                        store.setShouting(false)
                    }
                }

                requestAnimationFrame(checkAudioLevel)
            }
            checkAudioLevel()
            isAudioInitialized.value = true
        } catch (error) {
            console.error('Error accessing microphone:', error)
            errorMessage.value = 'Не удалось получить доступ к микрофону'
        }
    }

    const stopAudioAnalysis = () => {
        if (audioContext) {
            audioContext.close()
            audioContext = null
        }
        if (microphone) {
            microphone.disconnect()
            microphone = null
        }
        analyser = null
        isAudioInitialized.value = false
    }

    const normalizedAudioLevel = computed(() => {
        return Math.max(0, (smoothedAudioLevel.value - baselineNoiseLevel.value) / (1 - baselineNoiseLevel.value))
    })

    return {
        startAudioAnalysis,
        stopAudioAnalysis,
        isCalibrating,
        isAudioInitialized,
        errorMessage,
        normalizedAudioLevel
    }
}
