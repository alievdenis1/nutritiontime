import { defineStore } from 'pinia'

export const useCatClickerStore = defineStore('catClicker', {
    state: () => ({
        currency: 0,
        energyCurrent: 100,
        isRapidClicking: false,
        isShouting: false,
        shoutLevel: '',
        isShaking: false,
        shakeLevel: 'medium',
    }),
    actions: {
        addCurrency(amount: number) {
            this.currency += amount
        },
        useEnergy() {
            if (this.energyCurrent > 0) {
                this.energyCurrent--
            }
        },
        setRapidClicking(value: boolean) {
            this.isRapidClicking = value
        },
        setShouting(value: boolean, level = '') {
            this.isShouting = value
            this.shoutLevel = value ? level : ''
        },
        setShaking(value: boolean) {
            this.isShaking = value
        },
        setShakeLevel(level: string) {
            this.shakeLevel = level
        },
        setShoutLevel(level: string) {
            this.shoutLevel = level
        },
        setCurrency(value: number) {
            this.currency = value
        },
        setEnergyCurrent(value: number) {
            this.energyCurrent = value
        },
    },
})