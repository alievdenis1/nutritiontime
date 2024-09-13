<template>
	<TabsMain :default-value="'balance'">
		<div class="flex justify-between items-center mb-[16px]">
			<button
				class="p-[12px] rotate-180 shadow-2xl bg-white rounded-[50%] shadow-custom cursor-pointer"
				@click="$router.go(-1)"
			>
				<IconArrowRight icon-color="#1C1C1C" />
			</button>
			<h2 class="text-center text-lg text-darkGray">
				{{ t('wallet') }}
			</h2>
			<div />
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
			<div class="mt-5">
				Готовится к выпуску
			</div>
			<!--			<WalletHistory />-->
		</TabsContent>
	</TabsMain>
</template>

<script setup lang="ts">
import { TabsMain, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs'
import { IconArrowRight } from 'shared/components/Icon'
import { WalletBalance } from 'entities/Wallet/wallet-balance'
// import { WalletHistory } from 'entities/Wallet/wallet-history'
import { useTranslation } from '@/shared/lib/i18n'
import localizations from './WalletWidgets.localization.json'
const { t } = useTranslation(localizations)
</script>

<style scoped></style>
