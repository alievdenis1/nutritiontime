export const CLICKER_CONFIG = {
    animation: {
        click: {
            duration: 300,
            scaleFactor: 1.01,
            rotateFactor: 20,
            shadowFactor: 10
        },
        card: {
            duration: 2000,
            moveDistance: 150,
            rotateAngle: 10,
            initialOpacity: 1,
            finalOpacity: 0
        }
    },
    rapidClick: {
        threshold: 8,
        timeout: 150,
        shakeThreshold: 2,
        shoutThreshold: 1,
    },
    shake: {
        threshold: 14,
        timeout: 700,
    },
    style: {
        containerSize: 280,
        catImageOverflow: 20,
        backgroundColor: {
            normal: '#319A6E1A',
            rapid: '#ecae81'
        }
    },
    catEffect: {
        scaleFactor: 1.05,
        brightnessFactor: {
            min: 0.8,
            max: 1.5
        },
        hueRotateAngle: 40
    },
    vibration: {
        enabled: true,
        duration: 30,
        rapidClickDuration: 85
    },
    sound: {
        threshold: 0.0007,
        timeout: 2000,
    }
}

export const CALIBRATION_DURATION = 3200
export const NOISE_SAMPLES = 800
export const SHOUT_DETECTION_INTERVAL = 400