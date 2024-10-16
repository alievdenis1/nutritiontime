<template>
	<div class="px-[24px] py-[16px] shadow-custom rounded-[16px] mt-[16px]">
		<div class="flex gap-[16px] flex-col">
			<div class="font-bold text-xxxl flex gap-[10px] items-center">
				+500
				<IconGold />
			</div>
			<div>
				<h3 class="text-sm font-medium">
					{{ t('getBonus') }}
				</h3>
				<p class="text-sm">
					{{ t('eachFriend') }}
				</p>
			</div>
			<VButton
				v-if="isShareSupported"
				@click="shareMessage"
			>
				{{ t('inviteFriends') }}
				<IconArrowRight />
			</VButton>
			<VButton
				v-else
				@click="copyShareLink"
			>
				{{ t('inviteFriends') }}
				<IconArrowRight />
			</VButton>
		</div>
	</div>
	<div>
		<h4 class="font-medium mt-[20px] mb-[20px] text-darkGray text-lg">
			{{ t('history') }}
		</h4>
		<div
			v-if="walletHistory?.transactions?.length"
			class="flex flex-col gap-[8px]"
		>
			<div
				v-for="transaction in walletHistory?.transactions"
				:key="transaction.user_id"
				class="flex gap-[8px] justify-between items-end p-[16px] bg-white rounded-[16px]"
			>
				<div class="flex flex-col gap-[8px]">
					<div class="flex items-center">
						<span
							class="text-lg font-bold mr-[4px]"
							:class="getClass(transaction)"
						>
							{{ getSymbol(transaction) }}
							{{ Math.abs(Number(transaction.amount)) }}
						</span>
						<IconGold class="w-[24px] h-[24px]" />
					</div>
					<span>{{ getDescription(transaction) }}</span>
				</div>
				<div class="flex flex-col">
					<span class="text-slateGray">{{ new Date(transaction.created_at).toLocaleDateString() }}</span>
				</div>
			</div>
		</div>
		<div
			v-else
			class=" flex justify-center items-center flex-col gap-[16px] mt-[48px]"
		>
			<IconGold class="w-[80px] h-[80px]" />
			<div class="text-center w-[240px]">
				<p>{{ t('transactionHistory') }}</p>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { IconGold, IconArrowRight } from 'shared/components/Icon'
import { VButton } from 'shared/components/Button'
import {  useTranslation } from 'shared/lib/i18n'
import Localization from './WalletHistory.localization.json'
import { getWalletHistory } from '../api'
import { IWalletHistory, ITransaction } from '../types'
// TODO: так делать нельзя, но у нас UI Wallet-balance лежит в entities
import { useSessionStore } from '@/entities/Session'

const { t } = useTranslation(Localization)

const sessionStore = useSessionStore()
const { userInfo } = sessionStore

const walletHistory = ref<IWalletHistory | null>(null)

const isShareSupported = ref(false)

onMounted(async () => {
	isShareSupported.value = !!navigator.share

	const { execute, data } = getWalletHistory()
	await execute()

	walletHistory.value = data.value
})

const getClass = (transaction: ITransaction) => {
	const amount = Number(transaction.amount)

	if (amount === 0) return

	return amount > 0 ? 'text-tealGreen' : 'text-coralRed'
}

const getSymbol = (transaction: ITransaction) => {
	const amount = Number(transaction.amount)

	if (amount === 0) return

	return amount > 0 ? '+' : '-'
}

const getReferralDescription = (transaction: ITransaction) => {
	const description = transaction.description

	const templateString = 'Referral reward for inviting'

	const invitedUserName = description.replace(templateString, '').trim()

	return t('referral', { invitedUserName })
}

const getMiningDescription = () => {
	return t('mining')
}

const getDescription = (transaction: ITransaction) => {
	const type = transaction.type
	const description = transaction.description

	const selectDescriptionGetter: Record<string, (transaction: ITransaction) => string> = {
		referral: getReferralDescription,
		mining: getMiningDescription,
	}

	const descriptionGetter = selectDescriptionGetter[type]

	return descriptionGetter ? descriptionGetter(transaction) : description
}

const shareMessage = async () => {
	if (navigator.share) {
		try {
			await navigator.share({
				title: t('invitation'),
				text: t('invitationDescription'),
				// TODO: проверить, что при запуске приложения через бота - ключ тоже передаётся
				// (не передаётся, нужно использовать приложение, а не бота)
				url: `https://t.me/nutritiontime_bot/nutritiontime?startapp=${userInfo?.referral_code || ''}` // Заменить на реальный URL
				// TODO: возможно тут в ссылку в хэш добавлять id или userName текущего пользователя
				// А потом, когда другой пользователь перейдет по этой ссылке
				// Из хэша берем id пользователя, который отправил ссылку, и начисляем ему монеты
			})
		} catch (error: any) {
			// console.error('Ошибка при отправке сообщения:', error)
			// alert('Ошибка при отправке сообщения: ' + error.message)
		}
	} else {
		// console.warn('Функция Web Share API не поддерживается в этом браузере.')
		// alert('Функция Web Share API не поддерживается в этом браузере.')
	}
}

const copyShareLink = () => {
	const textToCopy = `https://t.me/nutritiontime_bot/nutritiontime?startapp=${userInfo?.referral_code || ''}` // Заменить на реальный URL
	navigator.clipboard.writeText(textToCopy).then(() => {
		alert('Ссылка скопирована в буфер обмена')
	}, (error) => {
		console.error('Ошибка при копировании текста:', error)
		alert('Ошибка при копировании текста: ' + error.message)
	})
}
</script>

<style scoped>
</style>