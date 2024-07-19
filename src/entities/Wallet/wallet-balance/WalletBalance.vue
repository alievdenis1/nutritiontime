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
					<span>{{ t('creditInfo') }}</span>
					<span>{{ t('globalNetworkInfo') }}</span>
				</div>
				<VButton
					:color="ButtonColors.Green"
					@click="closeModal"
				>
					{{ t('buttonConfirm') }}
				</VButton>
			</VModal>
		</div>
		<CatClicker
			class="mb-5"
			:energy-current="energyCurrency"
			:currency="currency"
			@update:currency="updateCurrency"
			@update:energy-current="updateEnergyCurrency"
		/>
		<div class="flex justify-between relative mt-20">
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
import { onMounted, ref, computed, nextTick, toRefs } from 'vue'
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
import { CatClicker } from 'entities/Wallet/wallet-balance'

const props = withDefaults(defineProps<{
	initialCurrency: number,
	initialEnergyCurrency: number
}>(), {
	initialCurrency: 0,
	initialEnergyCurrency: 1000
})

const { initialEnergyCurrency, initialCurrency } = toRefs(props)
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

const currency = ref(initialCurrency.value)
const energyCurrency = ref(initialEnergyCurrency.value)

const updateCurrency = (newValue: number) => {
	currency.value = newValue
}

const updateEnergyCurrency = (newValue: number) => {
	energyCurrency.value = newValue
}

const formattedCurrency = computed(() => {
	return currency.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
})
</script>

<style scoped lang="scss"></style>