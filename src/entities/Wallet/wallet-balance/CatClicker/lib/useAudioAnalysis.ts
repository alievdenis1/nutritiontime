import { onMounted, onUnmounted, nextTick } from 'vue'
import { CLICKER_CONFIG, CALIBRATION_DURATION, SHOUT_DETECTION_INTERVAL } from '../config'
import { useCatClickerState } from '../model/useCatClickerState'
import { useCatClickerActions } from '../model/useCatClickerActions'

export function useAudioAnalysis() {
    const state = useCatClickerState()
    const actions = useCatClickerActions()

    let shoutTimeout: number | null = null
    let audioContext: AudioContext | null = null
    let analyser: AnalyserNode | null = null
    let microphone: MediaStreamAudioSourceNode | null = null

    const startAudioAnalysis = async () => {
        if (state.isAudioInitialized.value) return

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
                return dataArray.reduce((acc, value) => acc + value, 0) / bufferLength / 255
            }

            const checkAudioLevel = () => {
                const currentLevel = getAudioLevel()
                state.normalizedAverage.value = currentLevel

                if (Date.now() - calibrationStartTime < CALIBRATION_DURATION) {
                    actions.updateNoiseLevel(currentLevel)
                } else {
                    if (state.isCalibrating.value) {
                        state.isCalibrating.value = false
                        console.log('Calibration complete. Baseline noise level:', state.baselineNoiseLevel.value)
                    }

                    actions.updateNoiseLevel(currentLevel)

                    if (Date.now() % SHOUT_DETECTION_INTERVAL < 20) {
                        const relativeIncrease = currentLevel / state.baselineNoiseLevel.value
                        state.relativeIncrease.value = relativeIncrease
                        state.currentLevel.value = currentLevel

                        state.testCounter.value++

                        nextTick(() => {
                            if (relativeIncrease > CLICKER_CONFIG.sound.threshold && currentLevel > 0.1) {
                                state.testCounter2.value++

                                if (!state.isShouting.value) {
                                    state.testCounter3.value++
                                    console.log('Shouting detected!')
                                    actions.setShouting(true)
                                }
                                if (shoutTimeout) clearTimeout(shoutTimeout)
                                shoutTimeout = window.setTimeout(() => {
                                    state.testCounter4.value++
                                    actions.setShouting(false)
                                }, CLICKER_CONFIG.sound.timeout)
                            }
                            state.forceUpdate.value++
                        })
                    }
                }

                requestAnimationFrame(checkAudioLevel)
            }

            checkAudioLevel()
            state.isAudioInitialized.value = true
        } catch (error) {
            console.error('Error accessing microphone:', error)
            state.errorMessage.value = 'Не удалось получить доступ к микрофону'
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
    }

    onMounted(() => {
        startAudioAnalysis()
    })

    onUnmounted(() => {
        stopAudioAnalysis()
    })

    return {
        startAudioAnalysis,
        stopAudioAnalysis
    }
}