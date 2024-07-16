<template>
	<div class="mt-[16px] mb-[60px]">
		<div class="flex justify-between items-center px-[24px] py-[16px] shadow-custom rounded-[16px]">
			<div class="flex gap-[10px] items-center">
				<div class="text-xxxl">
					{{ formattedCurrency }}
				</div>
				<IconGold />
			</div>

			<IconEnquiry
				class="cursor-pointer"
				@click="openModal"
			/>
			<VModal :show="show">
				<div class="flex justify-between mb-[12px] items-center">
					<h2 class="text-xl font-bold">
						{{ t('helpTitle') }}
					</h2>
					<button
						class="text-2xl w-[48px] h-[48px] bg-lightGray rounded-[50%] p-[14px] cursor-pointer"
						@click="closeModal"
					>
						<IconClose />
					</button>
				</div>
				<div class="flex flex-col gap-[20px] text-sm mb-[20px]">
					<span>
						{{ t('creditInfo') }}
					</span>
					<span>
						{{ t('globalNetworkInfo') }}
					</span>
				</div>
				<VButton
					:color="ButtonColors.Green"
					@click="closeModal"
				>
					{{ t('buttonConfirm') }}
				</VButton>
			</VModal>
		</div>
		<div
			class="img flex items-center justify-center rounded-[50%] h-[280px] bg-transparentGreen mt-[35px] max-w-max m-auto mb-[16px] relative min-w-[280px] min-h-[280px]"
			:class="{ 'clicked': isClicked }"
			@click="addCardAndAnimate"
		>
			<img
				src="/public/image/start-screen-image.webp"
				alt=""
				class="w-full h-full object-cover rounded-[50%] prevent-shrink"
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
		<div class="flex justify-between relative">
			<div
				class="flex gap-[4px] justify-center items-center shadow-custom rounded-[16px] max-w-max py-[6px] px-[12px]"
			>
				{{ energyCurrency }}
				<IconEnergy />
			</div>
			<div :class="{ 'opacity-0': loading }">
				<div
					v-if="!tonConnectActive"
					class="flex items-center gap-[8px] bg-forestGreen rounded-[16px] max-w-max py-[10px] px-[20px] cursor-pointer h-[44px]"
				>
					<div class="text-white text-sm">
						{{ t('connectWalletPrompt') }}
					</div>
					<IconArrowRight v-if="!isSmallScreen" />
				</div>
				<div
					v-else
					class="flex items-center justify-center w-[48px] bg-neonBlue rounded-[16px] relative cursor-pointer h-[44px]"
				>
					<IconDiamond />
				</div>
				<div
					id="ton-connect-button-root"
					class="absolute opacity-0 right-0 top-0"
				/>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed, nextTick } from 'vue'
import { IconGold, IconEnquiry, IconEnergy, IconArrowRight, IconClose, IconDiamond } from 'shared/components/Icon'
import { VModal } from 'shared/components/Modal'
import { VButton } from 'shared/components/Button'
import { ButtonColors } from 'shared/components/Button'
import WebApp from '@twa-dev/sdk'
import { useTWA } from 'entities/Wallet/api/useTWA'
import { useAuthButton } from 'entities/Wallet/api/useAuthButton'
import { getTonConnectUIInstance } from 'entities/Wallet/api/tonConnectUIInstance'
import { Locales, useLocaleStore, useTranslation } from 'shared/lib/i18n'
import Localization from './WalletBalance.localization.json'
import { Card } from './types'

const props = withDefaults(defineProps<{
	initialCurrency: number,
	initialEnergyCurrency: number
}>(), {
	initialCurrency: 0,
	initialEnergyCurrency: 100
})

const { t } = useTranslation(Localization)

const show = ref(false)
const tonConnectActive = ref(false)
const loading = ref(true)
const localeStore = useLocaleStore()

const openModal = () => {
	show.value = true
}

const closeModal = () => {
	show.value = false
}

const isSmallScreen = ref(window.innerWidth <= 380)

onMounted(async () => {
	const connect = getTonConnectUIInstance()
	tonConnectActive.value = await connect.connectionRestored
	await nextTick()
	useAuthButton()
	useTWA()
	const user = WebApp.initDataUnsafe.user
	if (user && user.language_code) {
		localeStore.setLocale(user.language_code as Locales)
	}
	loading.value = false
})

const cards = ref<Card[]>([])
let clickCount = 0

const currency = ref(props.initialCurrency)
const energyCurrency = ref(props.initialEnergyCurrency)

const formattedCurrency = computed(() => {
	return currency.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
})

const isClicked = ref(false)

const addCardAndAnimate = (event: MouseEvent) => {
	if (energyCurrency.value <= 0 || !event.currentTarget) return
	const rect = (event.currentTarget as HTMLElement).getBoundingClientRect()
	const x = event.clientX - rect.left
	const y = event.clientY - rect.top
	const duration = 2 - (y / rect.height) * 1.5
	cards.value.push({ id: clickCount++, x, y, duration })
	energyCurrency.value = Math.max(energyCurrency.value - 1, 0)
	currency.value++
	animateClick()
}

const animateClick = () => {
	isClicked.value = true
	setTimeout(() => {
		isClicked.value = false
	}, 300)
}

const removeCard = (id: number) => {
	cards.value = cards.value.filter(card => card.id !== id)
}
</script>

<style scoped lang="scss">
#card-container {
	@apply absolute inset-0 overflow-hidden pointer-events-none;
	z-index: 10;
}

.card {
	@apply absolute w-[75px] h-10 bg-white flex justify-center items-center text-[#1C1C1C] text-[24px] rounded-[16px] opacity-100;
	animation: moveUp ease-out forwards;
}

.img {
	position: relative;
	cursor: pointer;
	transition: transform 0.3s ease-in-out;
}

.img.clicked {
	animation: click-animation 0.3s ease-in-out;
}

@keyframes moveUp {
	0% {
		transform: translate(-50%, 0) rotate(0deg);
		opacity: 1;
	}

	25% {
		transform: translate(-50%, -75px) rotate(10deg);
	}

	50% {
		transform: translate(-50%, -100px) rotate(-10deg);
	}

	75% {
		transform: translate(-50%, -125px) rotate(10deg);
		opacity: 0.5;
	}

	100% {
		transform: translate(-50%, -150px) rotate(0deg);
		opacity: 0;
	}
}

@keyframes click-animation {
	0% {
		transform: scale(1);
	}

	50% {
		transform: scale(1.1);
	}

	100% {
		transform: scale(1);
	}
}
</style>