<template>
	<div class="min-h-screen pt-5 bg-gradient-to-br from-green-800 to-green-900 flex flex-col relative overflow-hidden">
		<!-- Background Elements -->
		<div class="absolute inset-0 cannabis-pattern opacity-20" />
		<div class="absolute top-0 left-0 right-0 h-32 gradient-overlay" />
		<div class="absolute inset-0 bg-gradient-radial from-transparent to-green-900 opacity-40" />

		<div class="flex-grow flex flex-col p-4 relative z-10">
			<!-- Page Title -->
			<h2 class="text-4xl font-bold text-yellow-400 text-center mb-6 animate-float">
				<span class="drop-shadow-glow text-stroke">Subscription Payment</span>
			</h2>

			<!-- Main Content -->
			<div
				v-if="!loading"
				class="max-w-2xl mx-auto w-full"
			>
				<!-- Payment Card -->
				<div class="bg-gray-800 bg-opacity-80 backdrop-filter backdrop-blur-xl rounded-2xl overflow-hidden shadow-2xl p-8 animate-fade-in transform hover:scale-[1.02] transition-all duration-300">
					<!-- Current Subscription Info -->
					<div
						v-if="subscription"
						class="mb-6 border-b border-gray-700 pb-4"
					>
						<h3 class="text-xl font-bold text-yellow-400 mb-3">
							Current Subscription
						</h3>
						<div class="space-y-2">
							<p class="text-yellow-400">
								Status:
								<span
									:class="{
										'text-green-400': subscription.subscription_status === 'active',
										'text-yellow-300': subscription.subscription_status === 'trial',
										'text-red-400': subscription.subscription_status === 'expired',
										'text-gray-400': subscription.subscription_status === 'inactive'
									}"
								>
									{{ subscription.subscription_status.toUpperCase() }}
								</span>
							</p>
							<p
								v-if="subscription.subscription_ends_at"
								class="text-yellow-400"
							>
								Expires: <span class="text-gray-300">{{ formatDate(subscription.subscription_ends_at) }}</span>
							</p>
						</div>
					</div>

					<!-- Subscription Period Selection -->
					<div class="mb-6">
						<h3 class="text-lg font-bold text-yellow-400 mb-3">
							Select Plan
						</h3>
						<SubscriptionPeriodSelector
							v-model="selectedPeriod"
							:disabled="paymentStatus === 'checking'"
						/>
					</div>

					<!-- Wallet Connection -->
					<div class="mb-6">
						<h3 class="text-lg font-bold text-yellow-400 mb-3">
							Connect Wallet
						</h3>
						<div class="flex justify-center">
							<TonConnectButton />
						</div>
					</div>

					<!-- Payment Method and Details -->
					<div
						v-if="walletInfo"
						class="space-y-6"
					>
						<!-- Payment Method Selection -->
						<div>
							<h3 class="text-lg font-bold text-yellow-400 mb-3">
								Payment Method
							</h3>
							<PaymentMethodSelector
								v-model="selectedPaymentMethod"
								:disabled="paymentStatus === 'checking'"
							/>
						</div>

						<!-- Payment Details -->
						<div
							v-if="payment"
							class="border-t border-gray-700 pt-4"
						>
							<h3 class="text-lg font-bold text-yellow-400 mb-3">
								Payment Details
							</h3>
							<div class="space-y-2">
								<p class="text-yellow-400">
									Selected Plan:
									<span class="text-gray-300">
										{{ selectedPeriod.months }} {{ selectedPeriod.months === 1 ? 'Month' : 'Months' }}
									</span>
								</p>
								<p class="text-yellow-400">
									Amount:
									<span class="text-green-400">
										{{ payment.amount_ton }} {{ selectedPaymentMethod.symbol }}
									</span>
								</p>
								<p class="text-yellow-400">
									Payment ID:
									<span class="text-gray-300">{{ payment.payment_id }}</span>
								</p>
								<p class="text-yellow-400">
									Expires:
									<span class="text-gray-300">{{ formatDate(payment.expires_at) }}</span>
								</p>
							</div>
						</div>

						<!-- Payment Actions -->
						<div class="space-y-4">
							<!-- Pay Button -->
							<button
								v-if="showPayButton"
								:disabled="isPayButtonDisabled"
								class="checkout-btn w-full"
								@click="processPayment"
							>
								<span class="relative z-10">{{ buttonText }}</span>
							</button>

							<!-- Payment Processing Status -->
							<div
								v-if="paymentStatus === 'checking'"
								class="text-center space-y-3"
							>
								<div class="flex items-center justify-center space-x-2">
									<div class="animate-spin rounded-full h-5 w-5 border-2 border-yellow-400 border-t-transparent" />
									<p class="text-yellow-400">
										Processing Payment...
									</p>
								</div>
								<p class="text-gray-300">
									Please confirm the transaction in your wallet
								</p>
								<p class="text-sm text-gray-400">
									Transaction will expire at {{ payment?.expires_at ? formatDate(payment.expires_at) : '' }}
								</p>
								<button
									class="cancel-btn w-full mt-4"
									@click="cancelPaymentProcess"
								>
									Cancel Payment
								</button>
							</div>
						</div>

						<!-- Error Display -->
						<div
							v-if="error"
							class="bg-red-900 bg-opacity-50 text-red-200 p-4 rounded-lg text-center"
						>
							{{ error }}
						</div>
					</div>

					<!-- Wallet Connection Prompt -->
					<div
						v-else
						class="text-yellow-400 text-center animate-pulse mt-4"
					>
						Please connect your wallet to proceed with payment
					</div>
				</div>
			</div>

			<!-- Loading State -->
			<div
				v-else
				class="max-w-2xl mx-auto w-full bg-gray-800 bg-opacity-80 backdrop-filter backdrop-blur-xl rounded-2xl overflow-hidden shadow-2xl p-8 animate-pulse"
			>
				<div class="flex items-center justify-center space-x-2">
					<div class="animate-spin rounded-full h-5 w-5 border-2 border-yellow-400 border-t-transparent" />
					<p class="text-yellow-400 text-xl">
						Loading subscription information...
					</p>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
 import { defineComponent, ref, computed, watch, onMounted } from 'vue'
 import { useRoute, useRouter } from 'vue-router'
 import { preparePayment, checkPaymentStatus, cancelPayment } from '../api'
 import { useSessionStore } from '@/entities/Session'
 import { storeToRefs } from 'pinia'
 import { TonConnectButton, useTonAddress, useTonWallet, useTonConnectUI } from '@townsquarelabs/ui-vue'
 import PaymentMethodSelector from './PaymentMethodSelector.vue'
 import SubscriptionPeriodSelector from './SubscriptionPeriodSelector.vue'
 import type { SendTransactionResponse } from '@tonconnect/sdk'
 import { Address, beginCell, toNano } from '@ton/core'
 import {
  AVAILABLE_PAYMENT_METHODS,
  SUBSCRIPTION_PERIODS,
  type PaymentMethod,
  type PreparedPayment,
  type UserSubscription,
  type SubscriptionPeriod,
  type PaymentProcessingStatus,
  type PaymentStatusResponse,
  type PaymentMethodType
 } from '../model'

 function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleString()
 }
 const MAX_COMMENT_LENGTH = 124

 export default defineComponent({
  name: 'PaymentView',
  components: {
   TonConnectButton,
   PaymentMethodSelector,
   SubscriptionPeriodSelector
  },

  setup() {
   // Stores
   const userStore = useSessionStore()
   const { userInfo } = storeToRefs(userStore)
   const telegramId = ref(~~(userInfo.value?.telegram_id ?? ''))
   // Router
   const route = useRoute()
   const router = useRouter()

   // Wallet Integration
   const address = useTonAddress()
   const wallet = useTonWallet()
   const [tonConnectUI] = useTonConnectUI()

   // Component State
   const loading = ref(true)
   const error = ref<string | null>(null)
   const subscription = ref<UserSubscription | null>(null)
   const payment = ref<PreparedPayment | null>(null)
   const paymentStatus = ref<PaymentProcessingStatus>('idle')
   const monitoringActive = ref(false)

   // User Selections
   const selectedPaymentMethod = ref<PaymentMethod>(AVAILABLE_PAYMENT_METHODS[0])
   const selectedPeriod = ref<SubscriptionPeriod>(SUBSCRIPTION_PERIODS[0])

   // Computed Properties
   const walletInfo = computed(() => wallet.value)

   const buttonText = computed(() => {
    switch (paymentStatus.value) {
     case 'idle': return `Pay ${selectedPeriod.value.months} Month${selectedPeriod.value.months > 1 ? 's' : ''}`
     case 'failed': return 'Retry Payment'
     case 'preparing': return 'Preparing Payment...'
     case 'checking': return 'Processing...'
     case 'completed': return 'Payment Completed!'
     default: return 'Pay'
    }
   })

   const showPayButton = computed(() => {
    return paymentStatus.value === 'idle' || paymentStatus.value === 'failed'
   })

   const isPayButtonDisabled = computed(() => {
    return loading.value ||
     !telegramId.value ||
     !payment.value?.amount_ton ||
     !selectedPaymentMethod.value ||
     paymentStatus.value === 'checking' ||
     paymentStatus.value === 'completed'
   })

   // Payment Processing
   const processPayment = async () => {
    if (!walletInfo.value || !address.value) {
     error.value = 'Please connect your wallet'
     return
    }

    if (!telegramId.value) {
     error.value = 'Invalid Telegram ID'
     return
    }

    try {
     paymentStatus.value = 'preparing'
     error.value = null

     const { data: paymentInfo, error: paymentError, execute } = preparePayment(
      telegramId.value,
      selectedPaymentMethod.value.symbol.toLowerCase() as PaymentMethodType,
      selectedPeriod.value.months
     )
     await execute()

     if (paymentError.value) {
      throw new Error(paymentError.value)
     }

     if (!paymentInfo.value) {
      throw new Error('Failed to prepare payment')
     }

     payment.value = paymentInfo.value
     paymentStatus.value = 'checking'

     const transaction = createPaymentTransaction(paymentInfo.value)

     tonConnectUI.sendTransaction(transaction)
      .then((result: SendTransactionResponse) => {
       console.log('Transaction sent:', result)
       if (paymentInfo.value) {
        monitorPaymentStatus(paymentInfo.value.payment_id)
       }
      })
      .catch(handleTransactionError)

    } catch (e) {
     handlePaymentError(e)
    }
   }

   const createPaymentTransaction = (paymentInfo: PreparedPayment) => {
    if (selectedPaymentMethod.value.type === 'ton') {
     const textEncoder = new TextEncoder()
     const commentBytes = Buffer.from(textEncoder.encode(paymentInfo.payment_comment))

     if (commentBytes.length > MAX_COMMENT_LENGTH) {
      throw new Error('Comment is too long')
     }

     const transaction = {
      validUntil: Math.floor(Date.now() / 1000) + 600,
      messages: [
       {
        address: paymentInfo.wallet_address,
        amount: toNano(paymentInfo.amount_ton).toString(),
        payload: beginCell()
         .storeUint(0, 32)
         .storeBuffer(commentBytes)
         .endCell()
         .toBoc()
         .toString('base64')
       }
      ]
     }

     return transaction
    }

    if (selectedPaymentMethod.value.type === 'jetton') {
     return {
      validUntil: Math.floor(Date.now() / 1000) + 600,
      messages: [
       {
        address: selectedPaymentMethod.value.address!,
        amount: toNano('0.05').toString(),
        payload: createJettonTransferPayload({
         jettonAmount: paymentInfo.amount_ton,
         toAddress: paymentInfo.wallet_address,
         responseAddress: address.value!,
         forwardAmount: toNano('0.000000001').toString(),
         forwardPayload: createCommentPayload(paymentInfo.payment_comment)
        })
       }
      ]
     }
    }

    throw new Error('Unsupported payment method')
   }

   const createCommentPayload = (comment: string): string => {
    const textEncoder = new TextEncoder()
    const commentBytes = textEncoder.encode(comment)

    const prefix = new Uint8Array(4)
    const fullMessage = new Uint8Array(prefix.length + commentBytes.length)
    fullMessage.set(prefix)
    fullMessage.set(commentBytes, prefix.length)

    return Buffer.from(fullMessage).toString('base64')
   }

   const createJettonTransferPayload = ({
                                         jettonAmount,
                                         toAddress,
                                         responseAddress,
                                         forwardAmount,
                                         forwardPayload
                                        }: {
    jettonAmount: number;
    toAddress: string;
    responseAddress: string;
    forwardAmount: string;
    forwardPayload: string;
   }) => {
    return beginCell()
     .storeUint(0xf8a7ea5, 32)
     .storeUint(0, 64)
     .storeCoins(toNano(jettonAmount))
     .storeAddress(Address.parse(toAddress))
     .storeAddress(Address.parse(responseAddress))
     .storeBit(false)
     .storeCoins(BigInt(forwardAmount))
     .storeBit(true)
     .storeRef(
      beginCell()
       .storeBuffer(Buffer.from(forwardPayload, 'base64'))
       .endCell()
     )
     .endCell()
     .toBoc()
     .toString('base64')
   }

   // Payment Status Monitoring
   const monitorPaymentStatus = (paymentId: number) => {
    if (monitoringActive.value) return

    paymentStatus.value = 'checking'
    monitoringActive.value = true
    let attempts = 0
    const maxAttempts = 60
    const delay = 5000

    const checkStatus = async () => {
     if (!monitoringActive.value) return

     if (attempts >= maxAttempts) {
      error.value = 'Payment verification timeout. Please check your wallet for the transaction status.'
      paymentStatus.value = 'failed'
      stopPaymentMonitoring()
      return
     }

     try {
      const { data: statusData, error: statusError, execute } = checkPaymentStatus(paymentId)
      await execute()

      if (statusError.value) {
       throw new Error(statusError.value)
      }

      if (statusData.value) {
       const response = statusData.value as PaymentStatusResponse
       switch (response.status) {
        case 'completed':
         paymentStatus.value = 'completed'
         stopPaymentMonitoring()
         router.push('/subscription/success')
         return
        case 'pending':
         console.log('Payment still pending')
         break
        case 'canceled':
         error.value = 'Payment was canceled'
         paymentStatus.value = 'failed'
         stopPaymentMonitoring()
         return
        case 'error':
         error.value = response.message || 'Payment failed'
         paymentStatus.value = 'failed'
         stopPaymentMonitoring()
         return
       }
      }

      attempts++
      setTimeout(checkStatus, delay)
     } catch (e) {
      console.error('Error checking payment status:', e)
      error.value = e instanceof Error ? e.message : 'Error checking payment status'
      paymentStatus.value = 'failed'
      stopPaymentMonitoring()
     }
    }

    checkStatus()
   }

   const stopPaymentMonitoring = () => {
    monitoringActive.value = false
   }

   // Error Handling
   const handleTransactionError = (e: unknown) => {
    console.error('Payment error:', e)
    if (e instanceof Error) {
     if (e.message.includes('Wallet declined the request')) {
      error.value = 'Payment failed: You declined the transaction in your wallet.'
     } else if (e.message.includes('Transaction was not sent')) {
      console.log('Transaction was not sent. Continuing to monitor payment status.')
      return
     } else {
      error.value = e.message
     }
    } else {
     error.value = 'Payment failed'
    }
    paymentStatus.value = 'failed'
    stopPaymentMonitoring()
   }

   const handlePaymentError = (e: unknown) => {
    console.error('Payment failed:', e)
    error.value = e instanceof Error ? e.message : 'Payment failed'
    paymentStatus.value = 'failed'
    stopPaymentMonitoring()
   }

   // Payment Cancellation
   const cancelPaymentProcess = async () => {
    if (payment.value?.payment_id) {
     const { error: cancelError, execute } = cancelPayment(payment.value.payment_id)
     await execute()

     if (cancelError.value) {
      console.error('Error cancelling payment:', cancelError.value)
     }
    }

    paymentStatus.value = 'idle'
    payment.value = null
    stopPaymentMonitoring()
   }

   // Watchers
   watch(selectedPaymentMethod, async () => {
    if (telegramId.value && selectedPeriod.value && paymentStatus.value !== 'checking') {
     await processPayment()
    }
   })

   watch(selectedPeriod, async () => {
    if (telegramId.value && paymentStatus.value !== 'checking') {
     await processPayment()
    }
   })

   watch(() => route.query, async (newQuery) => {
    if (newQuery.status === 'success') {
     router.push('/subscription/success')
    }
   })

   // Lifecycle Hooks
   onMounted(() => {
    if (!telegramId.value) {
     error.value = 'Invalid Telegram ID'
     loading.value = false
    } else {
     loading.value = false
    }
   })

   return {
    // State
    loading,
    error,
    subscription,
    payment,
    paymentStatus,
    selectedPaymentMethod,
    selectedPeriod,
    address,
    walletInfo,

    // Computed
    buttonText,
    showPayButton,
    isPayButtonDisabled,

    // Methods
    processPayment,
    cancelPaymentProcess,
    formatDate,

    // Constants
    AVAILABLE_PAYMENT_METHODS,
    SUBSCRIPTION_PERIODS
   }
  }
 })
</script>