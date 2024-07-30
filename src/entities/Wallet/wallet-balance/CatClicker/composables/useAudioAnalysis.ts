import { ref, onUnmounted } from 'vue'
import { useCatClickerStore, CLICKER_CONFIG } from 'entities/Wallet/wallet-balance/CatClicker'

export const useAudioAnalysis = () => {
    const store = useCatClickerStore()

    const CALIBRATION_DURATION = 3200
    const NOISE_SAMPLES = 800
    const SHOUT_DETECTION_INTERVAL = 400

    const isCalibrating = ref(true)
    const isAudioInitialized = ref(false)
    const errorMessage = ref('')
    const baselineNoiseLevel = ref(0)
    const noiseLevels = ref<number[]>([])

    let audioContext: AudioContext | null = null
    let analyser: AnalyserNode | null = null
    let microphone: MediaStreamAudioSourceNode | null = null
    let shoutTimeout: number | null = null

    const startAudioAnalysis = async () => {
        if (isAudioInitialized.value) return

        console.log('Attempting to access microphone...')
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
            console.log('Microphone access granted!')
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
                return dataArray.reduce((acc, value) => acc + value, 0) / bufferLength / 255
            }

            const updateNoiseLevel = (level: number) => {
                noiseLevels.value.push(level)
                if (noiseLevels.value.length > NOISE_SAMPLES) {
                    noiseLevels.value.shift()
                }
                baselineNoiseLevel.value = noiseLevels.value.reduce((sum, level) => sum + level, 0) / noiseLevels.value.length
            }

            const checkAudioLevel = () => {
                const currentLevel = getAudioLevel()

                if (Date.now() - calibrationStartTime < CALIBRATION_DURATION) {
                    updateNoiseLevel(currentLevel)
                } else {
                    if (isCalibrating.value) {
                        isCalibrating.value = false
                        console.log('Calibration complete. Baseline noise level:', baselineNoiseLevel.value)
                    }

                    updateNoiseLevel(currentLevel)

                    if (Date.now() % SHOUT_DETECTION_INTERVAL < 20) {
                        const relativeIncrease = currentLevel / baselineNoiseLevel.value

                        let shoutLevel = ''
                        if (relativeIncrease > CLICKER_CONFIG.sound.thresholdHigh) {
                            shoutLevel = 'high'
                        } else if (relativeIncrease > CLICKER_CONFIG.sound.thresholdMedium) {
                            shoutLevel = 'medium'
                        } else if (relativeIncrease > CLICKER_CONFIG.sound.thresholdLow) {
                            shoutLevel = 'low'
                        }

                        if (shoutLevel && currentLevel > 0.1) {
                            console.log(`Shouting detected! Level: ${shoutLevel}`)
                            store.setShouting(true, shoutLevel)
                            if (shoutTimeout) clearTimeout(shoutTimeout)
                            shoutTimeout = window.setTimeout(() => {
                                store.setShouting(false, '')
                            }, CLICKER_CONFIG.sound.timeout)
                        } else {
                            // Если нет мяуканья, сразу сбрасываем состояние
                            store.setShouting(false, '')
                        }
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
        if (shoutTimeout) {
            clearTimeout(shoutTimeout)
            shoutTimeout = null
        }
        isAudioInitialized.value = false
    }

    onUnmounted(() => {
        stopAudioAnalysis()
    })

    return {
        startAudioAnalysis,
        stopAudioAnalysis,
        isCalibrating,
        isAudioInitialized,
        errorMessage,
    }
}