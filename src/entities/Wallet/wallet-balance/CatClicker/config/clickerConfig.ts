import { reactive } from 'vue'

export const CLICKER_CONFIG = reactive({
    animation: {
        click: {
            duration: 300,           // Длительность анимации клика (мс)
            scaleFactor: 1.01,       // Фактор увеличения при клике
            rotateFactor: 20,        // Фактор вращения при клике (градусы)
            shadowFactor: 10         // Фактор тени при клике (пиксели)
        },
        card: {
            duration: 2000,          // Длительность анимации карточки (мс)
            moveDistance: 150,       // Дистанция перемещения карточки (пиксели)
            rotateAngle: 10,         // Угол вращения карточки (градусы)
            initialOpacity: 1,       // Начальная прозрачность карточки
            finalOpacity: 0          // Конечная прозрачность карточки
        }
    },
    rapidClick: {
        threshold: 8,              // Порог для определения быстрого клика
        timeout: 150,              // Время сброса счетчика быстрых кликов (мс)
        shakeThreshold: 2,      // Порог для определения быстрого клика при тряске
        shoutThreshold: 1,         //  порог при крике
    },
    shake: {
        thresholdLow: 20,
        thresholdMedium: 40,
        thresholdHigh: 60,
        timeout: 1000,
    },
    style: {
        containerSize: 280,        // Размер контейнера кликера (пиксели)
        catImageOverflow: 20,      // Процент выхода изображения кота за пределы контейнера
        backgroundColor: {
            normal: '#319A6E1A',     // Цвет фона в обычном состоянии
            rapid: '#ecae81'         // Цвет фона при быстром клике
        }
    },
    catEffect: {
        scaleFactor: 1.05,         // Фактор увеличения изображения кота при клике
        brightnessFactor: {
            min: 0.8,                // Минимальная яркость изображения при быстром клике
            max: 1.5                 // Максимальная яркость изображения при быстром клике
        },
        hueRotateAngle: 40         // Угол поворота цвета при быстром клике (градусы)
    },
    vibration: {
        enabled: true,             // Включить вибрацию
        duration: 30,              // Длительность вибрации в миллисекундах
        rapidClickDuration: 85     // Длительность вибрации при быстром клике
    },
    sound: {
        thresholdLow: 0.001,    // 10% выше базового уровня шума
        thresholdMedium: 1, // 30% выше базового уровня шума
        thresholdHigh: 3,   // 60% выше базового уровня шума
        timeout: 1000,
    },
})