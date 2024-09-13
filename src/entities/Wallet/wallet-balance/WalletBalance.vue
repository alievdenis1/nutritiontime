<template>
	<div class="mt-[16px] mb-[60px]">
		<div class="flex justify-between items-center px-[24px] py-[16px] shadow-custom rounded-[16px]">
			<div class="flex gap-[10px] items-center">
				<IconGold />

				<div class="text-xxxl">
					{{ formattedCurrency }}
				</div>
				<div class="text-lg font-bold">
					$RCPT
				</div>
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
					<span>{{ t('globalNetworkInfo') }}
						<a
							href="https://t.me/recipetonru"
							target="_blank"
							rel="noopener noreferrer"
							class="mt-5 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
						>
							<svg
								class="w-5 h-5 mr-2"
								fill="currentColor"
								viewBox="0 0 24 24"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.216-.054-.334-.373-.118L8.32 13.617l-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.941z"
								/>
							</svg>
							Присоединяйтесь к нашему Telegram каналу
						</a>
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
		<CatClicker
			:initial-energy-currency="initialEnergyCurrency"
			:initial-currency="initialCurrency"
			@update:currency="updateCurrency"
			@update:energy-current="updateEnergyCurrency"
		/>

		<div class="flex justify-between relative">
			<div
				class="flex gap-[4px] justify-center items-center shadow-custom rounded-[16px] max-w-max py-[6px] px-[12px] mr-2"
			>
				{{ energyCurrency }}
				<IconEnergy />
			</div>

			<div
				class="flex items-center gap-[8px] bg-gray rounded-[16px]
  max-w-max py-[10px] px-[20px] cursor-pointer h-[44px] relative lock-icon"
			>
				<div class="text-white text-sm">
					{{ t('connectWalletPrompt') }}
				</div>

				<IconArrowRight v-if="!isSmallScreen" />
			</div>

			<!--			<div :class="{ 'opacity-0': loading }">-->
			<!--				<div-->
			<!--					v-if="!tonConnectActive"-->
			<!--					class="flex items-center gap-[8px] bg-forestGreen rounded-[16px] max-w-max py-[10px] px-[20px] cursor-pointer h-[44px]"-->
			<!--				>-->
			<!--					<div class="text-white text-sm">-->
			<!--						{{ t('connectWalletPrompt') }}-->
			<!--					</div>-->
			<!--					<IconArrowRight v-if="!isSmallScreen" />-->
			<!--				</div>-->
			<!--				<div-->
			<!--					v-else-->
			<!--					class="flex items-center justify-center w-[48px] bg-neonBlue rounded-[16px] relative cursor-pointer h-[44px]"-->
			<!--				>-->
			<!--					<IconDiamond />-->
			<!--				</div>-->
			<!--				<div-->
			<!--					id="ton-connect-button-root"-->
			<!--					class="absolute opacity-0 right-0 top-0"-->
			<!--				/>-->
			<!--			</div>-->
		</div>
	</div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed, toRefs } from 'vue'
import {
  IconGold,
  IconEnquiry,
  IconEnergy,
  IconArrowRight,
  IconClose,
  // IconDiamond
} from 'shared/components/Icon'
import { VModal } from 'shared/components/Modal'
import { VButton } from 'shared/components/Button'
import { ButtonColors } from 'shared/components/Button'
import { useAuthWalletButton } from 'entities/Wallet/api/useAuthButton'
import { useTranslation } from 'shared/lib/i18n'
import Localization from './WalletBalance.localization.json'
import { CatClicker } from 'entities/Wallet/wallet-balance/CatClicker'

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
const loading = ref(true)

const openModal = () => {
	show.value = true
}

const closeModal = () => {
	show.value = false
}

const isSmallScreen = ref(window.innerWidth <= 380)

onMounted(async () => {
  const isLocal = import.meta.env.VITE_USE_TWA_MOCK

  if (isLocal) {
    console.warn('TWA is not available. Some features may not work correctly.')
  } else {
    useAuthWalletButton()
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

<style scoped lang="scss">
.lock-icon::after {
  content: '🔒';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.5);
  border-radius: inherit;
  font-size: 24px;
}
</style>