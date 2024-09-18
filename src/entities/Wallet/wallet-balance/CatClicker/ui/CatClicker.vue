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
