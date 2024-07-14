<template>
	<div class="px-[24px] py-[16px] shadow-custom rounded-[16px] mt-[16px]">
		<div class="flex gap-[16px] flex-col">
			<div class="text-xxxl flex gap-[10px] items-center">
				+500
				<IconGold />
			</div>
			<div>
				<h3>{{ t('getBonus') }}</h3>
				<p>{{ t('eachFriend') }}</p>
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
		<h4 class="mt-[20px] mb-[20px] text-darkGray text-lg">
			{{ t('history') }}
		</h4>
		<div
			v-if="transactions.length > 0"
			class="flex flex-col gap-[8px]"
		>
			<div
				v-for="transaction in transactions"
				:key="transaction.id"
				class="flex justify-between items-end p-[16px] bg-white rounded-[16px]"
			>
				<div class="flex flex-col gap-[8px]">
					<div class="flex items-center">
						<span
							class="text-lg font-bold mr-[4px]"
							:class="getClass(transaction)"
						>
							{{ getSymbol(transaction) }}
							{{ transaction.amount }}
						</span>
						<IconGold class="w-[24px] h-[24px]" />
					</div>
					<span>{{ transaction.title }}</span>
				</div>
				<div class="flex flex-col">
					<span class="text-slateGray">{{ transaction.date }}</span>
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
import { Transaction } from './types'
const { t } = useTranslation(Localization)

const transactions = ref<Transaction[]>([
	{ id: 1, amount: 500, title: 'Название транзакции', date: '11.02.2024', isActive: true },
	{ id: 2, amount: 300, title: 'Другая транзакция', date: '12.02.2024', isActive: false },
])

const isShareSupported = ref(false)

onMounted(() => {
	isShareSupported.value = !!navigator.share
})

const getClass = (transaction: Transaction) => {
	return transaction.isActive ? 'text-tealGreen' : 'text-coralRed'
}

const getSymbol = (transaction: Transaction) => {
	return transaction.isActive ? '+' : '-'
}

const shareMessage = async () => {
	if (navigator.share) {
		try {
			await navigator.share({
				title: 'Приглашение',
				text: 'Приглашаю тебя присоединиться и получить 500 $RECIPETON!',
				url: 'https://example.com' // Заменить на реальный URL
			})
			console.log('Сообщение отправлено успешно')
		} catch (error: any) {
			console.error('Ошибка при отправке сообщения:', error)
			alert('Ошибка при отправке сообщения: ' + error.message)
		}
	} else {
		console.warn('Функция Web Share API не поддерживается в этом браузере.')
		alert('Функция Web Share API не поддерживается в этом браузере.')
	}
}

const copyShareLink = () => {
	const textToCopy = 'https://example.com' // Заменить на реальный URL
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