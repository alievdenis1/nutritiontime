<template>
	<div
		ref="imgContainer"
		class="img-container flex items-center justify-center rounded-[50%] h-[280px] mt-[35px] max-w-max m-auto mb-[16px] relative min-w-[280px] min-h-[280px]"
		:class="{ 'bg-transparentGreen': !isRapidClicking, 'bg-rapidClickColor': isRapidClicking }"
		@click="addCardAndAnimate"
	>
		<div class="img-wrapper">
			<img
				src="/public/image/start-screen-image.webp"
				alt=""
				class="cat-image"
				:class="{ 'rapid-clicking': isRapidClicking }"
			>
		</div>
		<div
			id="card-container"
			class="absolute inset-0 pointer-events-none"
		>
			<TransitionGroup
				name="card"
				tag="div"
			>
				<div
					v-for="card in visibleCards"
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
			</TransitionGroup>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
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

const isRapidClicking = ref(false)
let clickSpeed = 0
let clickTimer: number | null = null

const visibleCards = computed(() => cards.value.slice(-20))

const addCardAndAnimate = (event: MouseEvent) => {
  if (props.energyCurrent <= 0 || !event.currentTarget) return
  const rect = (event.currentTarget as HTMLElement).getBoundingClientRect()
  const x = event.clientX - rect.left
  const y = event.clientY - rect.top
  const duration = 2 - (y / rect.height) * 1.5
  cards.value.push({ id: clickCount++, x, y, duration })

  emit('update:energyCurrent', props.energyCurrent - 1)
  emit('update:currency', props.currency + 1)

  animateClick(x, y)

  clickSpeed++
  isRapidClicking.value = clickSpeed > 5

  if (clickTimer) clearTimeout(clickTimer)
  clickTimer = window.setTimeout(() => {
    clickSpeed = 0
    isRapidClicking.value = false
  }, 500)
}

const animateClick = (x: number, y: number) => {
  if (imgContainer.value) {
    const centerX = imgContainer.value.offsetWidth / 2
    const centerY = imgContainer.value.offsetHeight / 2
    const distanceX = (x - centerX) / centerX
    const distanceY = (y - centerY) / centerY

    imgContainer.value.animate([
      { transform: 'scale(1)' },
      {
        transform: `scale(1.1) rotateX(${distanceY * 10}deg) rotateY(${-distanceX * 10}deg)`,
        boxShadow: `${distanceX * 20}px ${distanceY * 20}px 40px rgba(0,0,0,0.3)`
      },
      { transform: 'scale(1)' }
    ], {
      duration: 300,
      easing: 'ease-in-out'
    })

    const imgWrapper = imgContainer.value.querySelector('.img-wrapper') as HTMLElement
    if (imgWrapper) {
      imgWrapper.animate([
        { transform: 'scale(1) translate(0, 0)' },
        {
          transform: `scale(1.2) translate(${distanceX * 5}%, ${distanceY * 5}%)`,
        },
        { transform: 'scale(1) translate(0, 0)' }
      ], {
        duration: 300,
        easing: 'ease-in-out'
      })
    }
  }
}

const removeCard = (id: number) => {
  const index = cards.value.findIndex(card => card.id === id)
  if (index !== -1) {
    cards.value.splice(index, 1)
  }
}

onMounted(() => {
  window.addEventListener('visibilitychange', handleVisibilityChange)
})

onUnmounted(() => {
  window.removeEventListener('visibilitychange', handleVisibilityChange)
  if (clickTimer) clearTimeout(clickTimer)
})

const handleVisibilityChange = () => {
  if (document.hidden) {
    cards.value = []
    clickSpeed = 0
    isRapidClicking.value = false
    if (clickTimer) clearTimeout(clickTimer)
  }
}
</script>

<style scoped lang="scss">

.img-container {
  position: relative;
  cursor: pointer;
  transition: background-color 0.3s ease;
  perspective: 1000px;
  will-change: transform;
  overflow: hidden;
}

.img-wrapper {
  position: absolute;
  width: 120%;
  height: 120%;
  top: -10%;
  left: -10%;
  transition: transform 0.3s ease;
  will-change: transform;
}

.cat-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
  will-change: transform, filter;
}

.cat-image.rapid-clicking {
  animation: rapidClickingEffect 0.5s infinite alternate;
}

#card-container {
  @apply absolute inset-0 pointer-events-none;
  z-index: 10;
  overflow: visible;
}

.card {
  @apply absolute w-[75px] h-10 bg-white flex justify-center items-center text-[#1C1C1C] text-[24px] rounded-[16px] opacity-100;
  animation: moveUp ease-out forwards;
  will-change: transform, opacity;
}

.card-enter-active,
.card-leave-active {
  transition: opacity 0.3s, transform 0.3s;
}

.card-enter-from,
.card-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

@keyframes moveUp {
  0% { transform: translate(-50%, 0) rotate(0deg); opacity: 1; }
  25% { transform: translate(-50%, -75px) rotate(10deg); }
  50% { transform: translate(-50%, -100px) rotate(-10deg); }
  75% { transform: translate(-50%, -125px) rotate(10deg); opacity: 0.5; }
  100% { transform: translate(-50%, -150px) rotate(0deg); opacity: 0; }
}

@keyframes rapidClickingEffect {
  0% {
    transform: scale(1.1);
    filter: brightness(1.1) hue-rotate(0deg);
  }
  100% {
    transform: scale(1);
    filter: brightness(0.9) hue-rotate(30deg);
  }
}

.bg-rapidClickColor {
  background-color: #a9d745;
  animation: colorPulse 0.5s infinite alternate;
}

.bg-transparentGreen {
  background-color: #319A6E1A;
}

@keyframes colorPulse {
  0% { background-color: #a9d745; }
  100% { background-color: #d7a945; }
}
</style>