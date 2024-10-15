<!-- src/entities/Wallet/wallet-balance/WalletBalance.vue -->
<template>
	<div class="mt-[16px] wallet-ballance-container">
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
			<VModal
				:show="show"
				@close="closeModal"
			>
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
							{{ t('joinText') }}
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
			:wallet-connected="walletConnected"
			:has-nft="hasNFT"
		/>
		<div class="flex justify-between relative mt-8 mb-auto">
			<div
				class="flex gap-[4px] justify-center items-center shadow-custom rounded-[16px] max-w-max py-[6px] px-[12px] mr-2"
			>
				{{ energyCurrency }}
				<IconEnergy />
			</div>

			<TonConnectButton />
		</div>
		<div class="mt-[16px]">
			<Leaderboard />
		</div>
	</div>
</template>

<script setup lang="ts">
 import { onMounted, ref, computed, watch } from 'vue'
 import {
  IconGold,
  IconEnquiry,
  IconEnergy,
  IconClose,
 } from '@/shared/components/Icon'
 import { VModal } from '@/shared/components/Modal'
 import { VButton } from '@/shared/components/Button'
 import { ButtonColors } from '@/shared/components/Button'
 import { useTranslation } from '@/shared/lib/i18n'
 import Localization from './WalletBalance.localization.json'
 import CatClicker from './CatClicker/ui/CatClicker.vue'
 import Leaderboard from './LeaderBoard/LeaderBoard.vue'
 import { useCatClickerStore } from './CatClicker/model/cat-clicker-store'
 import { TonConnectButton, useTonAddress, useTonWallet } from '@townsquarelabs/ui-vue'
 import { TonApiClient, Api } from '@ton-api/client'
 import { Address } from '@ton/core'

 const { t } = useTranslation(Localization)

 const show = ref(false)
 const loading = ref(true)

 const openModal = () => {
  show.value = true
 }

 const closeModal = () => {
  show.value = false
 }

 const store = useCatClickerStore()

 const currency = computed(() => store.currency)
 const energyCurrency = computed(() => store.energyCurrent)

 const formattedCurrency = computed(() => {
  const value = currency.value ?? 0
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
 })

 // Новый код для проверки NFT с использованием TonAPI.io
 const walletConnected = ref(false)
 const checkingNFT = ref(false)
 const hasNFT = ref(false)
 const userAddress = useTonAddress()
 const wallet = useTonWallet()

 const COLLECTION_ADDRESS = 'EQDERkmRDrXxzEbZUMMgo3uDJwe24qUYpnasJ83WpQZaqjJ1'
 const collectionAddress = Address.parseFriendly(COLLECTION_ADDRESS).address
 // Инициализация TonAPI клиента
 const http = new TonApiClient({
  baseUrl: 'https://tonapi.io',
  // Замените на ваш реальный API ключ
  apiKey: 'AHHT737POV45FDIAAAAETF62HOODTD6YZHYXOLDBRN56L6DKRI6KJE3FMCRWSOFDSKQ77XY'
 })
 const api = new Api(http)

 async function checkNFT() {
  if (!userAddress.value) return

  checkingNFT.value = true
  hasNFT.value = false

  try {
   const rawAddress = Address.parseFriendly(userAddress.value).address

   const nftItems = await api.accounts.getAccountNftItems(rawAddress, {
    collection: collectionAddress,
    limit: 1,
    offset: 0
   })

   hasNFT.value = nftItems.nftItems?.length > 0
  } catch (error) {
   console.error('Error checking NFT:', error)
  } finally {
   checkingNFT.value = false
  }
 }

 // Следим за изменением кошелька
 watch(wallet, (newWallet) => {
  walletConnected.value = !!newWallet
  if (newWallet) {
   checkNFT()
  } else {
   hasNFT.value = false
  }
 })

 onMounted(async () => {
  const isLocal = import.meta.env.VITE_USE_TWA_MOCK

  if (isLocal) {
   console.warn('TWA is not available. Some features may not work correctly.')
  }

  loading.value = false

  // Проверяем NFT при монтировании, если кошелек уже подключен
  if (wallet.value) {
   walletConnected.value = true
   await checkNFT()
  }
 })
</script>

<style scoped lang="scss">
.wallet-ballance-container {
	min-height: calc(100vh - 160px);
	display: flex;
	flex-direction: column;
}

:deep(#ton-connect-button) {
 button {
  background-color: #319A6E !important;
 }
 button > div {
  @apply text-white font-normal text-sm
 }
 button path {
	fill: #fff
 }
}
</style>
