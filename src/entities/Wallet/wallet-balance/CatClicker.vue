<template>
	<div
		ref="imgContainer"
		class="img flex items-center justify-center rounded-[50%] h-[280px] mt-[35px] max-w-max m-auto mb-[16px] relative min-w-[280px] min-h-[280px]"
		:class="{ 'bg-transparentGreen': !isRapidClicking, 'bg-rapidClickColor': isRapidClicking }"
		@click="addCardAndAnimate"
	>
		<img
			src="/public/image/start-screen-image.webp"
			alt=""
		>
		<div
			id="card-container"
			class="absolute inset-0 overflow-hidden pointer-events-none"
		>
			<div
				v-for="card in cards"
				:key="card.id"
				class="card"
				:style="{
					left: `${card.x}px`,
					top: `${card.y}px`,
					animationDuration: `${card.duration}s`
				}"
				@animationend="removeCard(card.id)"
			>
				+1
				<IconGold class="w-[24px] h-[24px]" />
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { Card } from './types'
import { IconGold } from 'shared/components/Icon'

const props = defineProps<{
    currency: number,
    energyCurrent: number
}>()

const emit = defineEmits(['update:currency', 'update:energyCurrent'])

let clickCount = 0
const cards = ref<Card[]>([])
const imgContainer = ref<HTMLElement | null>(null)

const clickTimer = ref<number | null>(null)
const clickSpeed = ref(0)
const isRapidClicking = ref(false)

const addCardAndAnimate = (event: MouseEvent) => {
    if (props.energyCurrent <= 0 || !event.currentTarget) return
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    const duration = 2 - (y / rect.height) * 1.5
    cards.value.push({ id: clickCount++, x, y, duration })

    emit('update:energyCurrent', props.energyCurrent - 1)
    emit('update:currency', props.currency + 1)

    animateClick()

    clickSpeed.value++

    if (clickTimer.value) clearTimeout(clickTimer.value)
    clickTimer.value = window.setTimeout(() => {
        clickSpeed.value = 0
    }, 500)
}

const animateClick = () => {
    if (imgContainer.value) {
        imgContainer.value.animate([
            { transform: 'scale(1)' },
            { transform: 'scale(1.2)' },
            { transform: 'scale(1)' }
        ], {
            duration: 200,
            easing: 'ease-in-out'
        })
    }
}

const removeCard = (id: number) => {
    cards.value = cards.value.filter(card => card.id !== id)
}

watch(clickSpeed, (newSpeed) => {
    isRapidClicking.value = newSpeed > 5
})
</script>

<style scoped lang="scss">
.img {
    position: relative;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

#card-container {
    @apply absolute inset-0 overflow-hidden pointer-events-none;
    z-index: 10;
}

.card {
    @apply absolute w-[75px] h-10 bg-white flex justify-center items-center text-[#1C1C1C] text-[24px] rounded-[16px] opacity-100;
    animation: moveUp ease-out forwards;
}

@keyframes moveUp {
    0% {
        transform: translate(-50%, 0) rotate(0deg);
        opacity: 1;
    }

    25% {
        transform: translate(-50%, -100px) rotate(10deg);
    }

    50% {
        transform: translate(-50%, -125px) rotate(-10deg);
    }

    75% {
        transform: translate(-50%, -150px) rotate(10deg);
        opacity: 0.5;
    }

    100% {
        transform: translate(-50%, -175px) rotate(0deg);
        opacity: 0;
    }
}

.bg-rapidClickColor {
    background-color: #a9d745;
}

.bg-transparentGreen {
    background-color: #319A6E1A;
}
</style>