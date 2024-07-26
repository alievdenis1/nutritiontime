// cat-clicker-store.ts
import { defineStore } from 'pinia'

export const useCatClickerStore = defineStore('catClicker', {
    state: () => ({
        currency: 0,
        energyCurrent: 100,
        isRapidClicking: false,
        isShouting: false,
        isShaking: false,
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
        setShouting(value: boolean) {
            this.isShouting = value
        },
        setShaking(value: boolean) {
            this.isShaking = value
        },
        setCurrency(value: number) {
            this.currency = value
        },
        setEnergyCurrent(value: number) {
            this.energyCurrent = value
        },
    },
})