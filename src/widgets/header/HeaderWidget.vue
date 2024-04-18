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
import { ref, onMounted, computed } from 'vue'
import { Locales, useLocaleStore, useTranslation } from 'shared/lib/i18n'
import Localization from './HeaderWidget.localization.json'
import WebApp from '@twa-dev/sdk'

import { useSessionStore } from 'entities/Session'
import { useTWA } from 'shared/lib/twa'
import { useAuthButton } from 'shared/lib/ton-connect'

const localeStore = useLocaleStore()
const { t } = useTranslation(Localization)
const sessionStore = useSessionStore()

const languageDropDownOpen = ref(false)
const friendlyWalletAddress = computed(() => {
  return sessionStore.walletAddress
})

const shortenAddress = (str: string) => str.length > 10 ? `${str.substr(0, 4)}…${str.substr(-4)}` : str

onMounted(() => {
  useAuthButton()
  useTWA()
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

#ton-connect-button-root {
	@apply w-full;

	:deep([data-tc-connect-button]) {
		@apply w-full;

		div {
			@apply w-full text-xs
		}
	}
}

.language-dropdown {
  @apply absolute left-[-50px] z-20 flex flex-col border border-[#735F2B] text-[#735F2B];

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
