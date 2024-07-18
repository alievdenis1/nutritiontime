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
					:style="{
						left: `${card.x}px`,
						top: `${card.y}px`,
						animationDuration: `${CLICKER_CONFIG.animation.card.duration}ms`
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
import { IconGold } from 'shared/components/Icon'

// Конфигурация кликера
const CLICKER_CONFIG = {
  animation: {
    click: {
      duration: 300,           // Длительность анимации клика (мс)
      scaleFactor: 1.01,        // Фактор увеличения при клике
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
    timeout: 150               // Время сброса счетчика быстрых кликов (мс)
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
    scaleFactor: 1.05,          // Фактор увеличения изображения кота при клике
    brightnessFactor: {
      min: 0.8,                // Минимальная яркость изображения при быстром клике
      max: 1.5                 // Максимальная яркость изображения при быстром клике
    },
    hueRotateAngle: 40         // Угол поворота цвета при быстром клике (градусы)
  }
}

const props = defineProps<{
  currency: number,
  energyCurrent: number
}>()

const emit = defineEmits(['update:currency', 'update:energyCurrent'])

let clickCount = 0
const cards = ref<Array<{ id: number, x: number, y: number, duration: number }>>([])
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
  const duration = CLICKER_CONFIG.animation.card.duration / 1000 // Convert to seconds for CSS
  cards.value.push({ id: clickCount++, x, y, duration })

  emit('update:energyCurrent', props.energyCurrent - 1)
  emit('update:currency', props.currency + 1)

  animateClick(x, y)

  clickSpeed++
  isRapidClicking.value = clickSpeed > CLICKER_CONFIG.rapidClick.threshold

  if (clickTimer) clearTimeout(clickTimer)
  clickTimer = window.setTimeout(() => {
    clickSpeed = 0
    isRapidClicking.value = false
  }, CLICKER_CONFIG.rapidClick.timeout)
}

const animateClick = (x: number, y: number) => {
  if (imgContainer.value) {
    const { duration, scaleFactor, rotateFactor, shadowFactor } = CLICKER_CONFIG.animation.click
    const centerX = imgContainer.value.offsetWidth / 2
    const centerY = imgContainer.value.offsetHeight / 2
    const distanceX = (x - centerX) / centerX
    const distanceY = (y - centerY) / centerY

    imgContainer.value.animate([
      { transform: 'scale(1)' },
      {
        transform: `scale(${scaleFactor}) rotateX(${distanceY * rotateFactor}deg) rotateY(${-distanceX * rotateFactor}deg)`,
        boxShadow: `${distanceX * shadowFactor}px ${distanceY * shadowFactor}px ${shadowFactor * 2}px rgba(0,0,0,0.3)`
      },
      { transform: 'scale(1)' }
    ], {
      duration,
      easing: 'ease-in-out'
    })

    const imgWrapper = imgContainer.value.querySelector('.img-wrapper') as HTMLElement
    if (imgWrapper) {
      imgWrapper.animate([
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
  border-radius: 50%;
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