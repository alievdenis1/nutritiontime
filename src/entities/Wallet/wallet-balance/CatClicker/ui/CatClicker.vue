<template>
	<div>
		<div
			ref="imgContainer"
			class="img-container flex items-center justify-center h-[280px] mt-[35px] max-w-max m-auto mb-[16px] relative min-w-[280px] min-h-[280px]"
			:class="{ 'bg-transparentGreen': !store.isRapidClicking, 'bg-rapidClickColor': store.isRapidClicking }"
			@click="handleClick"
		>
			<div class="img-wrapper">
				<img
					src="/public/image/start-screen-image.webp"
					alt="Кот-повар"
					class="cat-image"
					:class="{ 'rapid-clicking': store.isRapidClicking }"
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
		<ConfigPanel />
	</div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { IconGold } from '@/shared/components/Icon'
import { CLICKER_CONFIG, useAudioAnalysis, useCards, useCatClickerStore } from 'entities/Wallet/wallet-balance/CatClicker'
import ConfigPanel from './ConfigPanel.vue'

const store = useCatClickerStore()

const props = defineProps<{
  initialEnergyCurrency: number,
  initialCurrency: number
}>()

const emit = defineEmits(['update:currency', 'update:energyCurrent'])

const { startAudioAnalysis, stopAudioAnalysis, isAudioInitialized } = useAudioAnalysis()
const { addCardAndAnimate, cards, removeCard, animateClick } = useCards()

const imgContainer = ref<HTMLElement | null>(null)
let shakeTimeout: number | null = null

const visibleCards = computed(() => cards.value.slice(-20))

const handleClick = (event: MouseEvent) => {
  addCardAndAnimate(event)
  if (imgContainer.value) {
    animateClick(event.clientX - imgContainer.value.offsetLeft, event.clientY - imgContainer.value.offsetTop, imgContainer.value)
  }

  if (!isAudioInitialized.value) {
    startAudioAnalysis()
  }
}

const handleDeviceMotion = (event: DeviceMotionEvent) => {
  const { accelerationIncludingGravity } = event
  if (accelerationIncludingGravity) {
    const acceleration = Math.sqrt(
      Math.pow(accelerationIncludingGravity.x || 0, 2) +
      Math.pow(accelerationIncludingGravity.y || 0, 2) +
      Math.pow(accelerationIncludingGravity.z || 0, 2)
    )

    if (acceleration > CLICKER_CONFIG.shake.threshold) {
      store.setShaking(true)
      if (shakeTimeout) clearTimeout(shakeTimeout)
      shakeTimeout = window.setTimeout(() => {
        store.setShaking(false)
      }, CLICKER_CONFIG.shake.timeout)
    }
  }
}

const handleVisibilityChange = () => {
  if (document.hidden) {
    store.setRapidClicking(false)
    store.setShaking(false)
    if (shakeTimeout) clearTimeout(shakeTimeout)
  }
}

onMounted(() => {
  window.addEventListener('visibilitychange', handleVisibilityChange)
  window.addEventListener('devicemotion', handleDeviceMotion)
  store.setCurrency(props.initialCurrency)
  store.setEnergyCurrent(props.initialEnergyCurrency)
})

onUnmounted(() => {
  window.removeEventListener('visibilitychange', handleVisibilityChange)
  window.removeEventListener('devicemotion', handleDeviceMotion)
  if (shakeTimeout) clearTimeout(shakeTimeout)
  stopAudioAnalysis()
})

watch(() => store.currency, (newValue) => {
  emit('update:currency', newValue)
})

watch(() => store.energyCurrent, (newValue) => {
  emit('update:energyCurrent', newValue)
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