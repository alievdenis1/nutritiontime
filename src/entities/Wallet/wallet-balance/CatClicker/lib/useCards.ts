import { ref, computed } from 'vue'
import { Card } from '../types/index'

export function useCards() {
    const cards = ref<Card[]>([])
    const visibleCards = computed(() => cards.value.slice(-20))

    let clickCount = 0

    const addCard = (x: number, y: number, duration: number, multiplier: number) => {
        cards.value.push({ id: clickCount++, x, y, duration, multiplier })
    }

    const removeCard = (id: number) => {
        const index = cards.value.findIndex(card => card.id === id)
        if (index !== -1) {
            cards.value.splice(index, 1)
        }
    }

    const clearCards = () => {
        cards.value = []
    }

    return {
        cards,
        visibleCards,
        addCard,
        removeCard,
        clearCards
    }
}