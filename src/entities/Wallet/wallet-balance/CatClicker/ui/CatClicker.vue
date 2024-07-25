<template>
	<div
		ref="imgContainer"
		class="img-container flex items-center justify-center h-[280px] mt-[35px] max-w-max m-auto mb-[16px] relative min-w-[280px] min-h-[280px]"
		:class="{ 'bg-transparentGreen': !isRapidClicking, 'bg-rapidClickColor': isRapidClicking }"
		@click="addCardAndAnimate"
	>
		<div
			ref="imgWrapper"
			class="img-wrapper"
		>
			<img
				src="/public/image/start-screen-image.webp"
				alt="Кот-повар"
				class="cat-image"
				:class="{ 'rapid-clicking': isRapidClicking }"
			>
		</div>
		<div id="card-container">
			<TransitionGroup
				name="card"
				tag="div"
			>
				<div
					v-for="card in visibleCards"
					:key="card.id"
					class="card"
					:class="{
						'double-reward': card.multiplier === 2,
						'quadruple-reward': card.multiplier === 4
					}"
					:style="{
						left: `${card.x}px`,
						top: `${card.y}px`,
						animationDuration: `${CLICKER_CONFIG.animation.card.duration}ms`
					}"
					@animationend="removeCard(card.id)"
				>
					+{{ card.multiplier }}
					<IconGold class="w-[24px] h-[24px]" />
				</div>
			</TransitionGroup>
		</div>
	</div>
	<div class="config-panel mb-4 p-4 bg-gray-100 rounded-lg">
		<div class="grid grid-cols-2 gap-4">
			<div class="flex flex-col gap-4">
				<br>
				<span class="text-amber-900">тряска: <span class="text-gray">
					{{ isShaking ? 'есть' : 'никакой' }}</span></span>
				<span class="text-amber-900">мяуканье: <span class="text-gray">{{ isShouting ? 'есть' : 'нет' }}</span></span>

				<br>
				<label class="block text-sm font-medium text-gray-700">Порог определения тряски</label>
				<input
					v-model.number="CLICKER_CONFIG.shake.threshold"
					type="number"
					class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
				>
			</div>
			<br>
			<div>
				<label class="block text-sm font-medium text-gray-700">Порог определения мяу</label>
				<input
					v-model.number="CLICKER_CONFIG.sound.threshold"
					type="number"
					step="0.1"
					min="0"
					max="1"
					class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
				>
			</div>

			Какие-то циферки: <br>
			{{ testCounter }} <br>
			{{ testCounter2 }} <br>
			{{ testCounter3 }} <br>
			{{ testCounter4 }} <br>

			{{ relativeIncrease }} <br>
			{{ CLICKER_CONFIG.sound.threshold }} <br>
			{{ currentLevel }} <br>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useCatClickerState } from '../model/useCatClickerState'
import { useCatClickerActions } from '../model/useCatClickerActions'
import { useAudioAnalysis } from '../lib/useAudioAnalysis'
import { useMotionDetection } from '../lib/useMotionDetection'
import { useCards } from '../lib/useCards'
import { CLICKER_CONFIG } from '../config'
import { IconGold } from 'shared/components/Icon'

const props = defineProps<{
  initialCurrency: number,
  initialEnergyCurrent: number
}>()

const emit = defineEmits(['update:currency', 'update:energyCurrent'])

const {
  currency,
  energyCurrent,
  isRapidClicking,
  isShouting,
  isShaking,
  testCounter,
  testCounter2,
  testCounter3,
  testCounter4,
  relativeIncrease,
  currentLevel
} = useCatClickerState()

const {
  addCurrency,
  useEnergy,
  setRapidClicking
} = useCatClickerActions()

const { startAudioAnalysis, stopAudioAnalysis } = useAudioAnalysis()
const { isShaking: motionShaking } = useMotionDetection()
const { visibleCards, addCard, removeCard, clearCards } = useCards()

const imgContainer = ref<HTMLElement | null>(null)
const imgWrapper = ref<HTMLElement | null>(null)
let lastClickTime = 0
const clickCooldown = 50 // минимальный интервал между анимациями в миллисекундах

let clickSpeed = 0
let clickTimer: number | null = null

const addCardAndAnimate = (event: MouseEvent) => {
  if (energyCurrent.value <= 0 || !event.currentTarget) return
  const rect = (event.currentTarget as HTMLElement).getBoundingClientRect()
  const x = event.clientX - rect.left
  const y = event.clientY - rect.top
  const duration = CLICKER_CONFIG.animation.card.duration / 1000 // Convert to seconds for CSS

  let multiplier = 1
  if (isShouting.value) {
    multiplier = 4
  } else if (isShaking.value) {
    multiplier = 2
  }

  addCard(x, y, duration, multiplier)

  useEnergy()
  addCurrency(multiplier)

  animateClick(x, y)

  clickSpeed++
  let currentThreshold = CLICKER_CONFIG.rapidClick.threshold
  if (isShaking.value) {
    currentThreshold = CLICKER_CONFIG.rapidClick.shakeThreshold
  }
  if (isShouting.value) {
    currentThreshold = CLICKER_CONFIG.rapidClick.shoutThreshold
  }
  setRapidClicking(clickSpeed > currentThreshold)

  vibrate(isRapidClicking.value ? CLICKER_CONFIG.vibration.rapidClickDuration : CLICKER_CONFIG.vibration.duration)

  if (clickTimer) clearTimeout(clickTimer)
  clickTimer = window.setTimeout(() => {
    clickSpeed = 0
    setRapidClicking(false)
  }, CLICKER_CONFIG.rapidClick.timeout)
}

const animateClick = (x: number, y: number) => {
  const now = Date.now()
  if (now - lastClickTime < clickCooldown) return
  lastClickTime = now

  if (imgContainer.value && imgWrapper.value) {
    const { duration, scaleFactor, rotateFactor, shadowFactor } = CLICKER_CONFIG.animation.click
    const containerRect = imgContainer.value.getBoundingClientRect()
    const centerX = containerRect.width / 2
    const centerY = containerRect.height / 2
    const distanceX = (x - centerX) / centerX
    const distanceY = (y - centerY) / centerY

    // Анимация контейнера
    imgContainer.value.animate([
      { transform: 'scale(1)', boxShadow: 'none' },
      {
        transform: `scale(${scaleFactor}) rotateX(${distanceY * rotateFactor}deg) rotateY(${-distanceX * rotateFactor}deg)`,
        boxShadow: `${distanceX * shadowFactor}px ${distanceY * shadowFactor}px ${shadowFactor * 2}px rgba(0,0,0,0.3)`
      },
      { transform: 'scale(1)', boxShadow: 'none' }
    ], {
      duration,
      easing: 'ease-in-out'
    })

    // Анимация обертки изображения
    imgWrapper.value.animate([
      { transform: 'scale(1) translate(0, 0)' },
      {
        transform: `scale(${CLICKER_CONFIG.catEffect.scaleFactor}) translate(${distanceX * 5}%, ${distanceY * 5}%)`,
      },
      { transform: 'scale(1) translate(0, 0)' }
    ], {
      duration,
      easing: 'ease-in-out'
    })
  }
}

const handleVisibilityChange = () => {
  if (document.hidden) {
    clearCards()
    clickSpeed = 0
    setRapidClicking(false)
    if (clickTimer) clearTimeout(clickTimer)
  }
}

const vibrate = (duration: number) => {
  if (CLICKER_CONFIG.vibration.enabled && 'vibrate' in navigator) {
    navigator.vibrate(duration)
  }
}

watch([testCounter, testCounter2, testCounter3, testCounter4], (newValues, oldValues) => {
  console.log('Counters changed:', newValues, oldValues)
})

watch(motionShaking, (newValue) => {
  isShaking.value = newValue
})

watch(currency, (newValue) => {
  emit('update:currency', newValue)
})

watch(energyCurrent, (newValue) => {
  emit('update:energyCurrent', newValue)
})

onMounted(() => {
  window.addEventListener('visibilitychange', handleVisibilityChange)
  currency.value = props.initialCurrency
  energyCurrent.value = props.initialEnergyCurrent
  startAudioAnalysis()
  imgWrapper.value = imgContainer.value?.querySelector('.img-wrapper') as HTMLElement
})

onUnmounted(() => {
  window.removeEventListener('visibilitychange', handleVisibilityChange)
  if (clickTimer) clearTimeout(clickTimer)
  stopAudioAnalysis()
})
</script>

<style scoped lang="scss">
.img-container {
  position: relative;
  cursor: pointer;
  transition: background-color 0.3s ease;
  perspective: 1000px;
  will-change: transform;
  border-radius: 50%;
  overflow: visible;
  width: v-bind('CLICKER_CONFIG.style.containerSize + "px"');
  height: v-bind('CLICKER_CONFIG.style.containerSize + "px"');
}

.img-wrapper {
  position: absolute;
  width: v-bind('(100 + CLICKER_CONFIG.style.catImageOverflow) + "%"');
  height: v-bind('(100 + CLICKER_CONFIG.style.catImageOverflow) + "%"');
  top: v-bind('(-CLICKER_CONFIG.style.catImageOverflow / 2) + "%"');
  left: v-bind('(-CLICKER_CONFIG.style.catImageOverflow / 2) + "%"');
  transition: transform 0.3s ease;
  will-change: transform;
  overflow: visible;
}

.cat-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
  will-change: transform, filter;
}

.cat-image.rapid-clicking {
  animation: rapidClickingEffect v-bind('CLICKER_CONFIG.rapidClick.timeout + "ms"') infinite alternate;
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
  pointer-events: none;

  &.double-reward {
    @apply w-[100px] h-14 text-[28px];
  }

  &.quadruple-reward {
    @apply w-[125px] h-16 text-[32px] text-[#ecae81];
  }
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
  0% {
    transform: translate(-50%, 0) rotate(0deg);
    opacity: v-bind('CLICKER_CONFIG.animation.card.initialOpacity');
  }

  25% {
    transform: v-bind('`translate(-50%, -${CLICKER_CONFIG.animation.card.moveDistance / 4}px) rotate(${CLICKER_CONFIG.animation.card.rotateAngle}deg)`');
  }

  50% {
    transform: v-bind('`translate(-50%, -${CLICKER_CONFIG.animation.card.moveDistance / 2}px) rotate(-${CLICKER_CONFIG.animation.card.rotateAngle}deg)`');
  }

  75% {
    transform: v-bind('`translate(-50%, -${CLICKER_CONFIG.animation.card.moveDistance * 3 / 4}px) rotate(${CLICKER_CONFIG.animation.card.rotateAngle}deg)`');
    opacity: v-bind('(CLICKER_CONFIG.animation.card.initialOpacity + CLICKER_CONFIG.animation.card.finalOpacity) / 2');
  }

  100% {
    transform: v-bind('`translate(-50%, -${CLICKER_CONFIG.animation.card.moveDistance}px) rotate(0deg)`');
    opacity: v-bind('CLICKER_CONFIG.animation.card.finalOpacity');
  }
}

@keyframes rapidClickingEffect {
  0% {
    transform: v-bind('`scale(${CLICKER_CONFIG.catEffect.scaleFactor})`');
    filter: v-bind('`brightness(${CLICKER_CONFIG.catEffect.brightnessFactor.max}) hue-rotate(0deg)`');
  }

  100% {
    transform: scale(1);
    filter: v-bind('`brightness(${CLICKER_CONFIG.catEffect.brightnessFactor.min}) hue-rotate(${CLICKER_CONFIG.catEffect.hueRotateAngle}deg)`');
  }
}

.bg-rapidClickColor {
  background-color: v-bind('CLICKER_CONFIG.style.backgroundColor.rapid');
}

.bg-transparentGreen {
  background-color: v-bind('CLICKER_CONFIG.style.backgroundColor.normal');
}
</style>