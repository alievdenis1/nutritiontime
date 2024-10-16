<template>
	<TabsMain :default-value="'balance'">
		<div class="wallet-header items-center mb-[16px] min-h-[44px]">
			<h2 class="text-center text-lg text-darkGray wallet-title">
				{{ t('wallet') }}
			</h2>
			<LanguageSwitcher class="lang-switcher" />
		</div>
		<TabsList>
			<TabsTrigger value="balance">
				{{ t('balance') }}
			</TabsTrigger>
			<TabsTrigger value="history">
				{{ t('history') }}
			</TabsTrigger>
		</TabsList>
		<TabsContent value="balance">
			<WalletBalance />
		</TabsContent>
		<TabsContent value="history">
			<WalletHistory />
		</TabsContent>
	</TabsMain>
</template>

<script setup lang="ts">
import { TabsMain, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs'
import { WalletBalance } from 'entities/Wallet/wallet-balance'
import { WalletHistory } from 'entities/Wallet/wallet-history'
import { useTranslation } from '@/shared/lib/i18n'
import { LanguageSwitcher } from '@/features/LanguageSwitcher'
import localizations from './WalletWidgets.localization.json'
const { t } = useTranslation(localizations)
</script>

<style scoped>
	.wallet-header {
		display: grid;
		grid-template-columns: 1fr auto 1fr;
		grid-template-areas: ". title lang";
	}

	.wallet-title {
		grid-area: title;
	}

	.lang-switcher {
		grid-area: lang;
		justify-self: end;
	}
</style>
