<template>
	<div class="grid">
		<header class="flex items-center gap-5 w-full">
			<img
				alt="Logo"
				height="34"
				src="/image/logo/logo-small.svg"
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
						<v-button
							:class="{'active': localeStore.currentLocale == 'ru'}"
							@click="localeStore.setLocale('ru')"
						>
							RUS
						</v-button>
						<v-button
							:class="{'active': localeStore.currentLocale == 'en'}"
							@click="localeStore.setLocale('en')"
						>
							ENG
						</v-button>
					</div>
				</v-button>
			</div>
		</header>
	</div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { Locales, useLocaleStore, useTranslation } from '@/shared/lib/i18n'
import { TonConnectUI, toUserFriendlyAddress } from '@tonconnect/ui'
import Localization from './HeaderWidget.localization.json'
import WebApp from '@twa-dev/sdk'

const localeStore = useLocaleStore()
const { t } = useTranslation(Localization)

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

  let user = WebApp.initDataUnsafe.user
  if (user && user.language_code) {
    localeStore.setLocale(user.language_code as Locales)
  }
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
  @apply absolute left-0 flex flex-col border border-[#735F2B] text-[#735F2B];

  v-button {
    padding: 0px 20px;
    border: 1px solid #735F2B;
    background: #FEF6DF;

    &:hover {
      background: #735F2B;
      color: #ffffff;
    }

    &.active {
      background: #735F2B;
      color: #ffffff;
    }

    &:first-child {
      border-radius: 20px 20px 0px 0px;
    }

    &:nth-child(2) {
      border-radius: 0px 0px 20px 20px;
    }

  }
}
</style>
