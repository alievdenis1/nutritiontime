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
			class="flex items-center justify-center rounded-[50%] bg-transparentGreen mt-[35px] h-[365px] max-w-max m-auto mb-[16px] relative"
		>
			<div
				id="card-container"
				class="absolute bottom-0 left-[50%]"
			>
				<div
					v-for="(card, index) in cards"
					:key="card.id"
					class="card"
					:style="{ animationDelay: `${index * 0.1}s` }"
					@animationend="removeCard(card.id)"
				>
					+1
					<IconGold class="w-[24px] h-[24px]" />
				</div>
			</div>
			<img
				src="/public/image/start-screen-image.webp"
				alt=""
				class="cursor-pointer"
				@click="addCard"
			>
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
					class="flex items-center gap-[8px] bg-forestGreen rounded-[16px] max-w-max py-[10px] px-[24px] cursor-pointer h-[44px]"
				>
					<div class="text-white">
						{{ t('connectWalletPrompt') }}
					</div>
					<IconArrowRight />
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
	initialEnergyCurrency: 10
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
const canClick = ref(true)

const currency = ref(props.initialCurrency)
const energyCurrency = ref(props.initialEnergyCurrency)

const formattedCurrency = computed(() => {
	return currency.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
})

const addCard = () => {
	if (!canClick.value || energyCurrency.value <= 0) return
	canClick.value = false
	cards.value.push({ id: clickCount++ })
	energyCurrency.value = Math.max(energyCurrency.value - 1, 0)
	currency.value++
	setTimeout(() => {
		canClick.value = true
	}, 800)
}

const removeCard = (id: number) => {
	cards.value = cards.value.filter(card => card.id !== id)
}
</script>

<style scoped lang="scss">
#card-container {
	@apply relative w-full h-full;
}

.card {
	@apply absolute bottom-0 left-1/2 transform -translate-x-1/2 w-[75px] h-10 bg-white flex justify-center items-center text-[#1C1C1C] text-[24px] rounded-[16px] opacity-100;
	animation: moveUp 2s ease-in-out forwards;
}

@keyframes moveUp {
	0% {
		bottom: 0;
		opacity: 1;
		transform: translateX(-50%) rotate(0deg);
	}

	25% {
		transform: translateX(-50%) rotate(10deg);
	}

	50% {
		transform: translateX(-50%) rotate(-10deg);
	}

	75% {
		transform: translateX(-50%) rotate(10deg);
		opacity: 0.5;
	}

	100% {
		bottom: 100%;
		opacity: 0;
	}
}
</style>
@/entities/Wallet/api/useTWA@/entities/Wallet/api/useAuthButton@/entities/Wallet/api/tonConnectUIInstance