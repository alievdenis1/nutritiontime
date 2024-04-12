<template>
	<div class="grid">
		<header class="flex items-center gap-5 w-full">
			<img
				alt="Logo"
				height="34"
				src="/image/logo/logo-small.webp"
				width="178"
			>

			<div class="flex items-center gap-[15px]">
				<v-button
					aria-label="Connect Wallet"
					class="connect-button"
					role="button"
				>
					<div
						id="ton-connect-button-root"
						class="absolute opacity-0 left-0"
					/>
					<img
						height="15"
						src="/image/icons/icon-ton.svg"
						width="19"
					>
					<span class="wallet-address">
						{{ friendlyWalletAddress ? shortenAddress(friendlyWalletAddress) : t('subscription') }}
					</span>
				</v-button>

				<v-button
					aria-label="Settings"
					class="settings-button"
					role="button"
					@click="languageDropDownOpen = !languageDropDownOpen"
				>
					<img
						height="25"
						src="/image/icons/icon-settings.svg"
						width="25"
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
  new TonConnectUI({
    manifestUrl: 'https://alievdenis1.github.io/nutritiolntime/tonconnect-manifest.json',
    buttonRootId: 'ton-connect-button-root',
    language: 'ru'
  })

  unsubscribe.value = tonConnectUI.value?.onStatusChange(walletInfo => {
    friendlyWalletAddress.value = walletInfo?.account?.address ? toUserFriendlyAddress(walletInfo.account.address) : ''
  })

  console.log('WebApp.initDataUnsafe', WebApp.initDataUnsafe.user)
  let user = WebApp.initDataUnsafe.user
//   WebApp.showAlert('Hey, ' + user.username + '. Your language is' + user.language_code)
//   console.log('name', WebApp.initData)
})
</script>

<style lang="scss" scoped>
.connect-button {
  @apply relative cursor-pointer flex items-center justify-center py-2 px-2.5 gap-2 border-solid border border-[#735F2B] rounded-[30px];
}

.wallet-address {
  @apply text-[#735F2B] text-xs font-normal;
}

.settings-button {
  @apply cursor-pointer relative;
}

.language-dropdown {
  @apply absolute right-0 bg-white text-black;
}
</style>
