<template>
	<div class="grid">
		<header class="flex items-center justify-between w-full">
			<img
				alt="Logo"
				height="30"
				src="/image/logo/logo-only.webp"
				width="30"
			>

			<div class="flex items-center gap-4">
				<v-button
					aria-label="Connect Wallet"
					class="connect-button"
					role="button"
				>
					<div
						id="ton-connect-button-root"
						class="absolute opacity-0 top-0 left-0"
					/>
					<span class="wallet-address">
						{{ friendlyWalletAddress ? shortenAddress(friendlyWalletAddress) : t('connect') }}
					</span>
					<img
						height="14"
						src="/image/icons/icon-ton.svg"
						width="14"
					>
				</v-button>

				<v-button
					aria-label="Settings"
					class="settings-button"
					role="button"
					@click="languageDropDownOpen = !languageDropDownOpen"
				>
					<img
						height="28"
						src="/image/icons/icon-settings.svg"
						width="28"
					>
					<div
						v-if="languageDropDownOpen"
						class="language-dropdown"
					>
						<v-button @click="localeStore.setLocale('ru')">
							Ru
						</v-button>
						<v-button @click="localeStore.setLocale('en')">
							En
						</v-button>
					</div>
				</v-button>
			</div>
		</header>
	</div>
</template>

<script lang="ts" setup>
import Localization from './HeaderWidget.localization.json'
import { useLocaleStore, useTranslation } from '@/shared/lib/i18n'
import WebApp from '@twa-dev/sdk'

const { t } = useTranslation(Localization)
import { TonConnectUI, toUserFriendlyAddress } from '@tonconnect/ui'
import { onMounted, ref } from 'vue'

const localeStore = useLocaleStore()
const languageDropDownOpen = ref(false)

const tonConnectUI = ref<TonConnectUI>()
const unsubscribe = ref()
const friendlyWalletAddress = ref('')

const shortenAddress = (str: string) => str.length > 10 ? `${str.substr(0, 4)}…${str.substr(-4)}` : str

onMounted(() => {
  tonConnectUI.value = new TonConnectUI({
    manifestUrl: 'https://alievdenis1.github.io/nutritiolntime/tonconnect-manifest.json',
    buttonRootId: 'ton-connect-button-root',
    language: 'ru'
  })

  unsubscribe.value = tonConnectUI.value?.onStatusChange(walletInfo => {
    friendlyWalletAddress.value = walletInfo?.account?.address ? toUserFriendlyAddress(walletInfo.account.address) : ''
  })

  console.log('WebApp.initDataUnsafe', WebApp.initDataUnsafe)
  WebApp.showAlert('Hey there!')
})
</script>

<style lang="scss" scoped>
.connect-button {
  @apply relative cursor-pointer flex items-center px-3 py-2 gap-2.5 border-solid border-2 border-[#968D7D] rounded-[66px];
}

.wallet-address {
  @apply text-[#968D7D] font-medium;
}

.settings-button {
  @apply cursor-pointer relative;
}

.language-dropdown {
  @apply absolute right-0 bg-white text-black;
}
</style>
