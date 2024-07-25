import { onMounted, onUnmounted } from 'vue'
import { CLICKER_CONFIG } from '../config'
import { useCatClickerState } from '../model/useCatClickerState'
import { useCatClickerActions } from '../model/useCatClickerActions'

export function useMotionDetection() {
    const state = useCatClickerState()
    const actions = useCatClickerActions()

    let shakeTimeout: number | null = null

    const handleDeviceMotion = (event: DeviceMotionEvent) => {
        const { accelerationIncludingGravity } = event
        if (accelerationIncludingGravity) {
            const acceleration = Math.sqrt(
                Math.pow(accelerationIncludingGravity.x || 0, 2) +
                Math.pow(accelerationIncludingGravity.y || 0, 2) +
                Math.pow(accelerationIncludingGravity.z || 0, 2)
            )

            if (acceleration > CLICKER_CONFIG.shake.threshold) {
                actions.setShaking(true)
                if (shakeTimeout) clearTimeout(shakeTimeout)
                shakeTimeout = window.setTimeout(() => {
                    actions.setShaking(false)
                }, CLICKER_CONFIG.shake.timeout)
            }
        }
    }

    onMounted(() => {
        window.addEventListener('devicemotion', handleDeviceMotion)
    })

    onUnmounted(() => {
        window.removeEventListener('devicemotion', handleDeviceMotion)
        if (shakeTimeout) clearTimeout(shakeTimeout)
    })

    return {
        isShaking: state.isShaking
    }
}