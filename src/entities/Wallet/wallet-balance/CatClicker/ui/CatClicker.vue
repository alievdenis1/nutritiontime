<template>
	<div>
		<div class="relative z-10 flex flex-row justify-end mt-[12px]">
			<button
				v-if="isDeviceMotionSupported"
				class="flex justify-center items-center shadow-custom rounded-[16px] min-w-[50px] max-w-max py-[6px] px-[6px] mr-2 text-xxl cursor-pointer"
				:class="{
					'bg-forestGreen': isMotionAvailable,
				}"
				@click="handleRequestMotion"
			>
				📳
			</button>
			<button
				class="flex justify-center items-center shadow-custom rounded-[16px] min-w-[50px] max-w-max py-[6px] px-[6px] text-xxl cursor-pointer"
				:class="{
					'bg-forestGreen': isMicrophoneAvailable,
				}"
				@click="handleRequestMicrophone"
			>
				🎤
			</button>
		</div>
		<div
			ref="imgContainer"
			class="img-container flex items-center justify-center h-[280px] max-w-max m-auto mb-[16px] relative min-w-[280px] min-h-[280px]"
			:class="{
				'bg-transparentGreen': !store.isRapidClicking,
				'bg-rapidClickColor': store.isRapidClicking,
				'cursor-not-allowed': !canClick,
				'opacity-30': !canClick
			}"
			@click="handleClickAndSync"
		>
			<div class="img-wrapper">
				<img
					src="/public/image/start-screen-image.webp"
					alt="Кот-повар"
					class="cat-image"
					:class="{ 'rapid-clicking': store.isRapidClicking }"
				>
			</div>
			<div id="card-container">
				<TransitionGroup
					name="card"
					tag="div"
				>
					<div
						v-for="card in visibleCards"
						:key="card.id"
						class="card"
						:class="{
							'double-reward': card.multiplier === 2,
							'quadruple-reward': card.multiplier === 4
						}"
						:style="{
							left: `${card.x}px`,
							top: `${card.y}px`,
							animationDuration: `${CLICKER_CONFIG.animation.card.duration}ms`
						}"
						@animationend="removeCard(card.id)"
					>
						+{{ card.multiplier }}
						<IconGold class="w-[24px] h-[24px]" />
					</div>
				</TransitionGroup>
			</div>
		</div>
		<VModal
			:show="isShowMotionModal"
			@close="closeMotionModal"
		>
			<div class="flex items-center justify-between mb-[12px]">
				<div class="text-xl text-darkGray">
					{{ t(MOTION_MODAL_TITLE[motionStatus || 'Error']) }}
				</div>
				<button
					class="text-2xl w-[48px] h-[48px] bg-lightGray rounded-[50%] p-[14px] cursor-pointer"
					@click="closeMotionModal"
				>
					<IconClose />
				</button>
			</div>
			<div class="mb-[20px]">
				{{ t(MOTION_MODAL_DESCRIPTION[motionStatus || 'Error']) }}
			</div>
			<div class="max-w-md mx-auto">
				<VButton
					:color="ButtonColors.Green"
					@click="closeMotionModal"
				>
					{{ t('motionModalSubmit') }}
				</VButton>
			</div>
		</VModal>
		<VModal
			:show="isShowMicrophoneModal"
			@close="closeMicrophoneModal"
		>
			<div class="flex items-center justify-between mb-[12px]">
				<div class="text-xl text-darkGray">
					{{ t(MICROPHONE_MODAL_TITLE[microphoneStatus || 'NotAllowedError']) }}
				</div>
				<button
					class="text-2xl w-[48px] h-[48px] bg-lightGray rounded-[50%] p-[14px] cursor-pointer"
					@click="closeMicrophoneModal"
				>
					<IconClose />
				</button>
			</div>
			<div class="mb-[20px]">
				{{ t(MICROPHONE_MODAL_DESCRIPTION[microphoneStatus || 'NotAllowedError']) }}
			</div>
			<div class="max-w-md mx-auto">
				<VButton
					:color="ButtonColors.Green"
					@click="closeMicrophoneModal"
				>
					{{ t('microphoneModalSubmit') }}
				</VButton>
			</div>
		</VModal>
		<ConnectWalletModal
			:is-show-connect-wallet-modal="isShowConnectWalletModal"
			:wallet-connected="props.walletConnected"
			@close-connect-wallet-modal="closeConnectWalletModal"
		/>
		<BuyNftModal
			:is-show-buy-nft-modal="isShowBuyNftModal"
			:has-nft="props.hasNft"
			@close-buy-nft-modal="closeBuyNftModal"
		/>
	</div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { VModal } from '@/shared/components/Modal'
import { VButton, ButtonColors } from '@/shared/components/Button'
import { IconGold } from '@/shared/components/Icon'
import { CLICKER_CONFIG, useAudioAnalysis, MicrophoneStatus, useCards, useCatClickerStore } from 'entities/Wallet/wallet-balance/CatClicker'
import twa from '@/shared/lib/api/twa'
import { useTranslation } from '@/shared/lib/i18n'
import ConnectWalletModal from './ConnectWalletModal.vue'
import BuyNftModal from './BuyNftModal.vue'
import Localization from '../CatClicker.localization.json'
import { MICROPHONE_MODAL_DESCRIPTION, MICROPHONE_MODAL_TITLE, MOTION_MODAL_DESCRIPTION, MOTION_MODAL_TITLE } from '../constants'

const { t } = useTranslation(Localization)

const store = useCatClickerStore()

const {
	startAudioAnalysis,
	stopAudioAnalysis,
	getMicrophonePermissionRequest,
	resetMicrophonePermission,
} = useAudioAnalysis()

const { addCardAndAnimate, cards, removeCard, animateClick } = useCards()

const props = withDefaults(
	defineProps<{ walletConnected?: boolean; hasNft?: boolean }>(),
	{
		walletConnected: false,
		hasNft: false,
	},
)

const imgContainer = ref<HTMLElement | null>(null)
let shakeTimeout: number | null = null
const visibleCards = computed(() => cards.value.slice(-20))

const regenerateEnergyIntervalId = ref<NodeJS.Timeout>()
const eventCount = ref(0)
const lastError = ref('')
const isDeviceMotionSupported = ref(false)

const canClick = computed(() => store.canClick)

const isShowConnectWalletModal = ref(false)
const isShowBuyNftModal = ref(false)

const closeConnectWalletModal = () => {
	isShowConnectWalletModal.value = false
}

const closeBuyNftModal = () => {
	isShowBuyNftModal.value = false
}

const isMicrophoneAvailable = ref(false)
const isShowMicrophoneModal = ref(false)
const microphoneStatus = ref<MicrophoneStatus | null>(null)

const closeMicrophoneModal = () => {
	isShowMicrophoneModal.value = false
}

const handleRequestMicrophone = async () => {
	if (isMicrophoneAvailable.value) {
		resetMicrophonePermission()
		stopAudioAnalysis()
		isMicrophoneAvailable.value = false

		return
	}

	const status = await getMicrophonePermissionRequest()
	microphoneStatus.value = status
	isShowMicrophoneModal.value = status !== 'Success'
	isMicrophoneAvailable.value = status === 'Success'

	if (status === 'Success') {
		startAudioAnalysis()
	}
}

const isMotionAvailable = ref(false)
const isShowMotionModal = ref(false)
const motionStatus = ref<'Success' | 'Error' | null>(null)

const closeMotionModal = () => {
	isShowMotionModal.value = false
}

const handleRequestMotion = async () => {
	if (isMotionAvailable.value) {
		resetDeviceMotion()
		isMotionAvailable.value = false

		return
	}

	if (isDeviceMotionSupported.value) {
		const status = await requestMotionPermission()
		motionStatus.value = status
		isShowMotionModal.value = status !== 'Success'
		isMotionAvailable.value = status === 'Success'
	}
}

const checkClickerAvailability = () => {
	const { hasNft, walletConnected } = props

	if (!walletConnected) {
		isShowConnectWalletModal.value = true
		return false
	}

	if (!hasNft) {
		isShowBuyNftModal.value = true
		return false
	}

	return true
}

const debounceSyncWithBackend = () => {
	let timer: NodeJS.Timeout

	const { syncWithBackend } = store

	return () => {
		if (timer) {
			clearTimeout(timer)
		}
		timer = setTimeout(() => {
			syncWithBackend()
		}, 700)
	}
}

const syncWithBackendFetch = debounceSyncWithBackend()

const handleClick = (event: MouseEvent) => {
	if (!checkClickerAvailability()) return

	if (!canClick.value) return

	let energySpent = 1
	let shakeClicks = store.isShaking ? 1 : 0
	let shoutClicks = store.isShouting ? 1 : 0

	// Мультитап не вычисляется здесь, а просто передается текущее состояние
	const isMultiClick = !!store.stats?.multi_tap_enabled

	let multiplier = 1
	if (store.isShouting) {
		multiplier = 4
	} else if (store.isShaking) {
		multiplier = 2
	}

	const clickResult = store.click(energySpent, isMultiClick, shakeClicks, shoutClicks)

	if (clickResult) {
		if (imgContainer.value) {
			const rect = imgContainer.value.getBoundingClientRect()
			const x = event.clientX - rect.left
			const y = event.clientY - rect.top
			animateClick(x, y, imgContainer.value)
			addCardAndAnimate(x, y, multiplier)
		}

		// if (!isAudioInitialized.value && isMicrophoneAvailable.value) {
		//   startAudioAnalysis()
		// }
	}
}

const handleClickAndSync = (event: MouseEvent) => {
	const { energyThresholdSyncRequest } = store

	handleClick(event)

	energyThresholdSyncRequest()

	syncWithBackendFetch()
}

const handleDeviceMotion = (event: DeviceMotionEvent) => {
	try {
		eventCount.value++
		console.log('Device motion event received', event)

		const { accelerationIncludingGravity } = event

		if (accelerationIncludingGravity) {
			const acceleration = Math.sqrt(
				Math.pow(accelerationIncludingGravity.x || 0, 2) +
          Math.pow(accelerationIncludingGravity.y || 0, 2) +
          Math.pow(accelerationIncludingGravity.z || 0, 2)
			) - 9.81

			console.log('Calculated acceleration:', acceleration)

			let threshold = CLICKER_CONFIG.shake.thresholdMedium

			if (acceleration > threshold) {
				console.log('Shake detected!')
				store.setShaking(true)

				twa && twa.HapticFeedback.impactOccurred('heavy')

				if (shakeTimeout) clearTimeout(shakeTimeout)
				shakeTimeout = window.setTimeout(() => {
					store.setShaking(false)
				}, CLICKER_CONFIG.shake.timeout)
			}
		}
	} catch (error) {
		console.error('Error in handleDeviceMotion:', error)
		lastError.value = error instanceof Error ? error.message : 'Unknown error in handleDeviceMotion'
	}
}

const requestMotionPermission = async () => {
	try {
		if (typeof (DeviceMotionEvent as any).requestPermission === 'function') {
			const permissionState = await (DeviceMotionEvent as any).requestPermission()
			if (permissionState === 'granted') {
				window.addEventListener('devicemotion', handleDeviceMotion)
				console.log('Motion permission granted')
				return 'Success'
			} else {
				console.error('Motion permission denied')
				lastError.value = 'Motion permission denied. Please enable it in your device settings.'
				return 'Error'
			}
		} else {
			window.addEventListener('devicemotion', handleDeviceMotion)
			console.log('Motion listener added without permission request')
			return 'Success'
		}
	} catch (error: any) {
		console.error('Error requesting motion permission:', error)
		lastError.value = error.message
		return 'Error'
	}
}

const resetDeviceMotion = () => {
	window.removeEventListener('devicemotion', handleDeviceMotion)
}

const checkDeviceMotionSupport = () => {
	isDeviceMotionSupported.value = 'DeviceMotionEvent' in window
	console.log('Device motion supported:', isDeviceMotionSupported.value)
	if (!isDeviceMotionSupported.value) {
		lastError.value = 'Device motion is not supported on this device. Using alternative shake detection.'
	}
}

const handleVisibilityChange = () => {
	if (document.hidden) {
		store.setRapidClicking(false)
		store.setShaking(false)
		if (shakeTimeout) clearTimeout(shakeTimeout)
	}
}

onMounted(() => {
	const fetch = async () => {
		const { initialStatsRequest, syncInterval, regenerateEnergy } = store

		await initialStatsRequest()

		regenerateEnergyIntervalId.value = setInterval(() => {
			regenerateEnergy()
		}, syncInterval)
	}

	fetch()
})

onUnmounted(() => {
	const { resetLastEnergyUpdateTimestamp } = store

	if (regenerateEnergyIntervalId.value) {
		clearInterval(regenerateEnergyIntervalId.value)
	}

	resetLastEnergyUpdateTimestamp()
})

onMounted(async () => {
	window.addEventListener('visibilitychange', handleVisibilityChange)
	checkDeviceMotionSupport()
})

onUnmounted(() => {
	window.removeEventListener('visibilitychange', handleVisibilityChange)
	window.removeEventListener('devicemotion', handleDeviceMotion)
	if (shakeTimeout) clearTimeout(shakeTimeout)
	resetMicrophonePermission()
	stopAudioAnalysis()
})
</script>

<style scoped lang="scss">
.img-container {
  position: relative;
  cursor: pointer;
  transition: background-color 0.3s ease;
  perspective: 1000px;
  will-change: transform;
  border-radius: 50%;
  overflow: visible;
  width: v-bind('CLICKER_CONFIG.style.containerSize + "px"');
  height: v-bind('CLICKER_CONFIG.style.containerSize + "px"');
}

.img-wrapper {
  position: absolute;
  width: v-bind('(100 + CLICKER_CONFIG.style.catImageOverflow) + "%"');
  height: v-bind('(100 + CLICKER_CONFIG.style.catImageOverflow) + "%"');
  top: v-bind('(-CLICKER_CONFIG.style.catImageOverflow / 2) + "%"');
  left: v-bind('(-CLICKER_CONFIG.style.catImageOverflow / 2) + "%"');
  transition: transform 0.3s ease;
  will-change: transform;
  overflow: visible;
}

.cat-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
  will-change: transform, filter;
}

.cat-image.rapid-clicking {
  animation: rapidClickingEffect v-bind('CLICKER_CONFIG.rapidClick.timeout + "ms"') infinite alternate;
}

#card-container {
  @apply absolute inset-0 pointer-events-none;
  z-index: 10;
  overflow: visible;
}

.card {
  @apply absolute w-[75px] h-10 bg-white flex justify-center items-center text-[#1C1C1C] text-[24px] rounded-[16px] opacity-100;
  animation: moveUp ease-out forwards;
  will-change: transform, opacity;
  pointer-events: none;

  &.double-reward {
    @apply w-[100px] h-14 text-[28px];
  }

  &.quadruple-reward {
    @apply w-[125px] h-16 text-[32px] text-[#ecae81];
  }
}

.card-enter-active,
.card-leave-active {
  transition: opacity 0.3s, transform 0.3s;
}

.card-enter-from,
.card-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

.permission-button {
  display: block;
  margin: 1rem auto;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: darken(#319A6E, 10%);
  }
}

@keyframes moveUp {
  0% {
    transform: translate(-50%, 0) rotate(0deg);
    opacity: v-bind('CLICKER_CONFIG.animation.card.initialOpacity');
  }

  25% {
    transform: v-bind('`translate(-50%, -${CLICKER_CONFIG.animation.card.moveDistance / 4}px) rotate(${CLICKER_CONFIG.animation.card.rotateAngle}deg)`');
  }

  50% {
    transform: v-bind('`translate(-50%, -${CLICKER_CONFIG.animation.card.moveDistance / 2}px) rotate(-${CLICKER_CONFIG.animation.card.rotateAngle}deg)`');
  }

  75% {
    transform: v-bind('`translate(-50%, -${CLICKER_CONFIG.animation.card.moveDistance * 3 / 4}px) rotate(${CLICKER_CONFIG.animation.card.rotateAngle}deg)`');
    opacity: v-bind('(CLICKER_CONFIG.animation.card.initialOpacity + CLICKER_CONFIG.animation.card.finalOpacity) / 2');
  }

  100% {
    transform: v-bind('`translate(-50%, -${CLICKER_CONFIG.animation.card.moveDistance}px) rotate(0deg)`');
    opacity: v-bind('CLICKER_CONFIG.animation.card.finalOpacity');
  }
}

@keyframes rapidClickingEffect {
  0% {
    transform: v-bind('`scale(${CLICKER_CONFIG.catEffect.scaleFactor})`');
    filter: v-bind('`brightness(${CLICKER_CONFIG.catEffect.brightnessFactor.max}) hue-rotate(0deg)`');
  }

  100% {
    transform: scale(1);
    filter: v-bind('`brightness(${CLICKER_CONFIG.catEffect.brightnessFactor.min}) hue-rotate(${CLICKER_CONFIG.catEffect.hueRotateAngle}deg)`');
  }
}

.bg-rapidClickColor {
  background-color: v-bind('CLICKER_CONFIG.style.backgroundColor.rapid');
}

.bg-transparentGreen {
  background-color: v-bind('CLICKER_CONFIG.style.backgroundColor.normal');
}
</style>