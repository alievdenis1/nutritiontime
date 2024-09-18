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
						v-for="card in cards"
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
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { IconGold } from '@/shared/components/Icon'
import { CLICKER_CONFIG, useCards } from '@/entities/Wallet/wallet-balance/CatClicker'
import { useCatClickerStore } from '../model/cat-clicker-store'

const store = useCatClickerStore()
const { addCardAndAnimate, cards, removeCard, animateClick } = useCards()

const imgContainer = ref<HTMLElement | null>(null)

const handleClick = async (event: MouseEvent) => {
  if (store.energyCurrent <= 0) {
    // Нет энергии
    return
  }

  // Определяем мультипликатор
  let multiplier = 1
  if (store.isShouting) {
    multiplier = 4
  } else if (store.isShaking) {
    multiplier = 2
  }

  // Отправляем клик на сервер с учётом мультипликатора
  await store.processClick(1, multiplier) // Передаем clickCount = 1 и multiplier

  // Получаем координаты клика
  if (!imgContainer.value) return
  const rect = imgContainer.value.getBoundingClientRect()
  const x = event.clientX - rect.left
  const y = event.clientY - rect.top

  // Анимации
  animateClick(x, y, imgContainer.value)
  addCardAndAnimate(x, y, multiplier)
}

onMounted(() => {
  store.fetchClickerStats()
  store.fetchEnergyStatus()
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

.permission-button {
  display: block;
  margin: 1rem auto;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: darken(#319A6E, 10%);
  }
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
