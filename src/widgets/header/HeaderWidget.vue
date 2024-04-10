<template>
	<div class="grid">
		<header class="flex items-center justify-between w-full">
			<img
				alt="logo"
				height="30"
				src="/image/logo/logo-only.webp"
				width="30"
			>

			<div class="flex items-center gap-4">
				<v-button class="relative cursor-pointer flex items-center px-3 py-2 gap-2.5 border-solid border-2 border-[#968D7D] rounded-[66px]">
					<div
						id="ton-connect-button-root"
						class="absolute opacity-0 top-0 left-0"
					/>
					<span class="text-[#968D7D] font-medium">
						{{ t('connect') }}
					</span>
					<img
						height="14"
						src="/image/icons/icon-ton.svg"
						width="14"
					>
				</v-button>
				<v-button
					class="cursor-pointer relative"
					@click="languageDropDownOpen = !languageDropDownOpen"
				>
					<img
						height="28"
						src="/image/icons/icon-settings.svg"
						width="28"
					>
					<div
						v-if="languageDropDownOpen"
						class="absolute right-0 bg-white text-black"
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
import { TonConnectUI } from '@tonconnect/ui'
import { onMounted, ref } from 'vue'
import Localization from './HeaderWidget.localization.json'
import { useLocaleStore, useTranslation } from '@/shared/lib/i18n'

const localeStore = useLocaleStore()

const languageDropDownOpen = ref<boolean>()
const { t } = useTranslation(Localization)

onMounted(() => {
  new TonConnectUI({ //connect application
    manifestUrl: 'https://alievdenis1.github.io/nutritiolntime/tonconnect-manifest.json',
    buttonRootId: 'ton-connect-button-root',
	language: 'ru'
  })
})

</script>

<style lang="scss" scoped></style>
