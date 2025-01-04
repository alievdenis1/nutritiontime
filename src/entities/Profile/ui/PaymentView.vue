// PaymentView.vue
<template>
	<div
		class="min-h-screen pt-5 bg-gradient-to-br from-green-800
	to-green-900 flex flex-col relative overflow-hidden p-4"
	>
		<TabsMain :default-value="activeTab">
			<TabsList>
				<TabsTrigger value="plans">
					{{ t('plans') }}
				</TabsTrigger>
				<TabsTrigger
					value="payments"
					@click="fetchUserPayments()"
				>
					{{ t('payments') }}
				</TabsTrigger>
			</TabsList>

			<!-- Тарифы -->
			<TabsContent value="plans">
				<!-- Выбор плана -->
				<div
					v-if="!selectedPlan"
					class="grid md:grid-cols-3 gap-6 pt-4"
				>
					<SubscriptionPlan
						v-for="plan in subscriptionPlans"
						:key="plan.months"
						:months="plan.months"
						:price="plan.price"
						:features="plan.features"
						:selected="false"
						:discount="plan.discount"
						@select="selectPlan(plan)"
					/>
				</div>

				<!-- Выбор метода оплаты -->
				<div
					v-else
					class="p-4 space-y-6"
				>
					<div>
						<VButton
							variant="outline"
							size="small"
							:color="ButtonColors.White"
							@click="handleBack"
						>
							{{ t('backToPlans') }}
						</VButton>
						<h3 class="text-xl font-semibold mt-5">
							{{ t('subscriptionFor').replace('{months}', selectedPlan?.months?.toString() || '').replace('{monthForm}', monthDeclension) }}
						</h3>
					</div>

					<div class="space-y-4">
						<p class="text-lg" /><p>{{ t('selectPaymentMethod') }}</p>
						<div class="grid grid-cols-2 gap-4">
							<PaymentMethod
								v-for="method in paymentMethods"
								:key="method.type"
								:type="method.type"
								:title="method.title"
								:selected="selectedPaymentMethod?.type === method.type"
								@select="selectPaymentMethod(method)"
							/>
						</div>
						<div class="mt-4">
							<PaymentMethod
								:type="rubPaymentMethod.type"
								:title="rubPaymentMethod.title"
								:description="rubPaymentMethod.description"
								:selected="selectedPaymentMethod?.type === rubPaymentMethod.type"
								@select="selectPaymentMethod(rubPaymentMethod)"
							/>
						</div>
					</div>

					<div
						v-if="calculatedAmount"
						class="text-center text-lg"
					>
						<div>
							{{ t('totalAmount').replace('{amount}', calculatedAmount.amount).replace('{currency}', calculatedAmount.currency) }}
						</div>
					</div>

					<!-- Кнопка оплаты -->
					<VButton
						class="w-full"
						:disabled="!selectedPaymentMethod || isProcessing"
						@click="handlePayment"
					>
						<div class="flex items-center justify-center">
							<VLoading
								v-if="isProcessing"
								class="mr-2"
							/>
							<span>{{ isProcessing ? t('processing') : t('pay') }}</span>
						</div>
					</VButton>
				</div>
			</TabsContent>

			<!-- Платежи -->
			<TabsContent
				value="payments"
				class="mb-4"
			>
				<div>
					<PaymentsList
						class="pt-4"
						:payments="userPayments"
						:loading="paymentsLoading"
						@refresh="fetchUserPayments"
					/>
				</div>
			</TabsContent>
		</TabsMain>
	</div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useSessionStore } from '@/entities/Session'
import { TabsContent, TabsList, TabsMain, TabsTrigger } from 'shared/components/ui/tabs'
import { ButtonColors, VButton } from '@/shared/components/Button'
import { VLoading } from '@/shared/components/Loading'
import { SubscriptionPlan, PaymentMethod, PaymentsList } from './index.ts'
import {
	createPayment, getUserPayments, calculateAmount,
	sendToSubscription
} from '../api'
import type { SubscriptionPayment } from '../model'
import WebApp from '@twa-dev/sdk'
import localization from './ProfileStats.localization.json'
import { useTranslation } from '@/shared/lib/i18n'
import { useRoute } from 'vue-router'

const route = useRoute()

const { t } = useTranslation(localization)

// Store и telegram_id
const userStore = useSessionStore()
const { userInfo } = storeToRefs(userStore)
const telegramId = ref(~~(userInfo.value?.telegram_id ?? ''))

 type SubscriptionPlanType = {
 	months: number
 	price: number
 	features: string[]
 }
 // Состояние
const activeTab = ref('plans')
const selectedPlan = ref<SubscriptionPlanType | null>(null)
 type BasePaymentMethod = {
 	type: 'ton' | 'usdt' | 'yummy' | 'gram' | 'upay'
 	title: string
 	description: string
 }

// Component state
const selectedPaymentMethod = ref<BasePaymentMethod | null>(null)

const isProcessing = ref(false)
const userPayments = ref<SubscriptionPayment[]>([])
const paymentsLoading = ref(false)
const calculatedAmount = ref<{ amount: string; currency: string } | null>(null)

// Вычисляемые свойства
// Функция для склонения месяцев
const monthDeclension = computed(() => {
	if (!selectedPlan.value?.months) return ''
	const months = selectedPlan.value.months
	const lastDigit = months % 10
	const lastTwoDigits = months % 100

	if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
		return t('monthPlural')
	}
	if (lastDigit === 1) {
		return t('monthSingular')
	}
	if (lastDigit >= 2 && lastDigit <= 4) {
		return t('monthFew')
	}
	return t('monthPlural')
})

// Данные тарифных планов
const monthlyPrice = 490

const subscriptionPlans = [
	{ months: 1, price: 490, features: [] },
	{
		months: 3,
		price: 1200,
		features: [],
		discount: Math.round((1 - (1200 / 3 / monthlyPrice)) * 100) // будет примерно 12%
	},
	{
		months: 12,
		price: 4000,
		features: [],
		discount: Math.round((1 - (4000 / 12 / monthlyPrice)) * 100) // будет примерно 23%
	}
]
// Методы оплаты
const paymentMethods = [
	{
		type: 'ton' as const,
		title: 'TON',
		description: 'The Open Network'
	},
	{
		type: 'usdt' as const,
		title: 'USDT',
		description: 'Tether USD'
	},
	{
		type: 'yummy' as const,
		title: 'YUMMY',
		description: 'Yummy Token'
	},
	{
		type: 'gram' as const,
		title: 'GRAM',
		description: 'Gram Token'
	}
]

const rubPaymentMethod = {
	type: 'upay' as const,
	title: 'RUB',
	description: 'UPay'
}

// Методы
const selectPlan = (plan: typeof subscriptionPlans[0]) => {
	selectedPlan.value = plan
	selectedPaymentMethod.value = null
	calculatedAmount.value = null
}

const handleBack = () => {
	selectedPlan.value = null
	selectedPaymentMethod.value = null
	calculatedAmount.value = null
}

const selectPaymentMethod = async (method: BasePaymentMethod) => {
	selectedPaymentMethod.value = method

	if (!selectedPlan.value) return

	if (method.type === 'upay') {
		calculatedAmount.value = {
			amount: selectedPlan.value.price.toString(),
			currency: '₽'
		}
		return
	}

	try {
		const calculateApi = calculateAmount({
			payment_type: method.type,
			months: selectedPlan.value.months
		})

		await calculateApi.execute()

		if (!calculateApi.error.value && calculateApi.data.value) {
			calculatedAmount.value = calculateApi.data.value
		}
	} catch (error) {
		console.error('Calculate amount error:', error)
	}
}

// Updated handlePayment function
const handlePayment = async () => {
	if (!selectedPlan.value || !selectedPaymentMethod.value) return

	try {
		isProcessing.value = true

		if (selectedPaymentMethod.value.type === 'upay') {
			await sendToSubscription({ months: selectedPlan.value.months }).execute()
			WebApp.close()
			return
		}

		const paymentApi = createPayment({
			telegram_id: telegramId.value,
			payment_type: selectedPaymentMethod.value.type,
			months: selectedPlan.value.months
		})

		await paymentApi.execute()

		if (!paymentApi.error.value && paymentApi.data.value?.paymentUrl) {
			const paymentUrl = paymentApi.data.value.paymentUrl
			WebApp.openLink(paymentUrl)
			fetchUserPayments()
		}
	} catch (error) {
		console.error('Payment creation error:', error)
	} finally {
		isProcessing.value = false
	}
}

const fetchUserPayments = async () => {
	paymentsLoading.value = true
	try {
		const paymentsApi = getUserPayments()
		await paymentsApi.execute()

		if (!paymentsApi.error.value && paymentsApi.data.value) {
			userPayments.value = paymentsApi.data.value
		}
	} catch (error) {
		console.error('Fetch payments error:', error)
	} finally {
		paymentsLoading.value = false
	}
}

// Инициализация
onMounted(() => {
	const selectedMonths = route.query.months

	if (selectedMonths && !Array.isArray(selectedMonths)) {
		const months = parseInt(selectedMonths)
		if (!isNaN(months)) {
			const plan = subscriptionPlans.find(plan => plan.months === months)
			if (plan) {
				selectPlan(plan)
			}
		}
	}

	fetchUserPayments()
})
</script>