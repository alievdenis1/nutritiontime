<template>
	<div class="space-y-4">
		<div
			v-if="loading"
			class="flex justify-center p-8"
		>
			<VLoading />
		</div>

		<template v-else>
			<div
				v-for="payment in sortedPayments"
				:key="payment.id"
				class="p-4 rounded-lg shadow-sm border border-gray-700 bg-gray-800/50"
			>
				<div>
					<div class="flex justify-between items-start">
						<div>
							<p class="font-medium">
								{{ t('subscriptionFor').replace('{months}', (payment.months ?? 1).toString()).replace('{monthForm}', getMonthForm(payment.months ?? 1)) }}
							</p>
							<div class="mt-1 text-sm text-gray-400 space-y-1">
								<p>{{ formatDate(payment.created_at) }}</p>
								<p>{{ t('amount').replace('{amount}', payment.amount_rub) }}</p>
								<p v-if="payment.crypto_amount">
									{{ t('cryptoAmount')
										.replace('{amount}', payment.crypto_amount)
										.replace('{currency}', payment.crypto_currency) }}
								</p>
							</div>
						</div>

						<div class="text-right space-y-2">
							<span
								class="px-2 py-1 rounded text-sm font-medium"
								:class="getStatusClasses(payment.status)"
							>
								{{ getStatusText(payment.status) }}
							</span>
						</div>
					</div>

					<!-- Действия для ожидающих платежей -->
					<div
						v-if="payment.status === 'PENDING'"
						class="flex flex-row justify-between mt-5"
					>
						<div
							class="text-red underline w-full text-center p-5"
							@click="handleCancelPayment(payment.id)"
						>
							{{ t('cancel') }}
						</div>
						<VButton
							v-if="payment.payment_url"
							size="small"
							@click="handlePaymentUrl(payment.payment_url)"
						>
							{{ t('pay') }}
						</VButton>
					</div>
				</div>
			</div>

			<div
				v-if="!payments.length"
				class="text-center text-gray-400 py-8"
			>
				{{ t('emptyHistory') }}
			</div>
		</template>
	</div>
</template>

<script setup lang="ts">
 import { ref, computed } from 'vue'
 import { VLoading } from '@/shared/components/Loading'
 import { VButton } from '@/shared/components/Button'
 import WebApp from '@twa-dev/sdk'
 import type { SubscriptionPayment } from '../model'
 import { cancelPayment } from '../api'
 import localization from './ProfileStats.localization.json'
 import { useTranslation, useLocaleStore } from '@/shared/lib/i18n'

 const { t } = useTranslation(localization)
 const localStore = useLocaleStore()

 const props = defineProps<{
  payments: SubscriptionPayment[]
  loading: boolean
 }>()

 const emit = defineEmits<{
  (e: 'refresh'): void
 }>()

 const cancellingPaymentId = ref<number | null>(null)

 // Сортировка платежей по дате (новые сверху)
 const sortedPayments = computed(() => {
  return [...props.payments].sort(
   (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  )
 })

 // Форматирование даты
 const formatDate = (date: string) => {
  const isRu = localStore.currentLocale === 'ru'
  return new Date(date).toLocaleString(isRu ? 'ru-RU' : 'en-US', {
   year: 'numeric',
   month: 'long',
   day: 'numeric',
   hour: '2-digit',
   minute: '2-digit'
  })
 }

 // Получение текста статуса
 const getStatusText = (status: string) => {
  return t(status.toLowerCase()) || status
 }

 // Получение классов для статуса
 const getStatusClasses = (status: string) => {
  const baseClasses = 'inline-block'
  const statusClassMap: Record<string, string> = {
   'PENDING': 'bg-yellow-900/50 text-yellow-400',
   'COMPLETED': 'bg-green-900/50 text-green-400',
   'CANCELED': 'bg-red-900/50 text-red-400',
   'canceled': 'bg-red-900/50 text-red-400',
   'CANCELLED': 'bg-red-900/50 text-red-400',
   'FAILED': 'bg-red-900/50 text-red-400'
  }
  return `${baseClasses} ${statusClassMap[status] || 'bg-gray-900/50 text-gray-400'}`
 }

 // Обработчики действий
 const handlePaymentUrl = (url: string) => {
  WebApp.openLink(url)
 }

 const handleCancelPayment = async (paymentId: number) => {
  try {
   cancellingPaymentId.value = paymentId
   const { execute } = cancelPayment(paymentId)
   await execute()

    emit('refresh')

  } catch (error) {
   console.error('Payment cancellation error:', error)
  } finally {
   cancellingPaymentId.value = null
  }
 }

 const getMonthForm = (months: number) => {
  const monthKey = getMonthDeclension(months)
  return t(monthKey)
 }

 const getMonthDeclension = (months: number) => {
  const lastDigit = months % 10
  const lastTwoDigits = months % 100

  if (lastTwoDigits >= 11 && lastTwoDigits <= 19) return 'monthPlural'
  if (lastDigit === 1) return 'monthSingular'
  if (lastDigit >= 2 && lastDigit <= 4) return 'monthFew'
  return 'monthPlural'
 }
</script>