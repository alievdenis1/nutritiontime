<template>
	<div class="mt-[16px] mb-[60px]">
		<div class="flex justify-between items-center px-[24px] py-[16px] shadow-custom rounded-[16px]">
			<div class="flex gap-[10px] items-center">
				<div class="text-xxxl">
					{{ formattedCurrency }}
				</div>
				<IconGold />
			</div>

			<IconEnquiry
				class="cursor-pointer"
				@click="openModal"
			/>
			<VModal :show="show">
				<div class="flex justify-between mb-[12px] items-center">
					<h2 class="text-xl font-bold">
						Заголовок справки
					</h2>
					<button
						class="text-2xl w-[48px] h-[48px] bg-lightGray rounded-[50%] p-[14px] cursor-pointer"
						@click="closeModal"
					>
						<IconClose />
					</button>
				</div>
				<div>
					<span>
						Текст-информация о том, как происходит зачисление и что будет потом. Пока текст-рыба.
					</span>
					<span>
						Противоположная точка зрения подразумевает, что базовые сценарии поведения пользователей
						формируют глобальную экономическую сеть и при этом — объективно рассмотрены соответствующими
						инстанциями! Следует отметить, что высокое качество позиционных исследований предопределяет
						высокую востребованность поставленных обществом задач. Вот вам яркий пример современных
						тенденций — начало повседневной работы по формированию позиции представляет собой интересный
						эксперимент проверки системы обучения кадров, соответствующей насущным потребностям.
					</span>
				</div>
				<VButton
					:color="ButtonColors.Green"
					@click="closeModal"
				>
					Понятно
				</VButton>
			</VModal>
		</div>
		<div
			class="flex items-center justify-center rounded-[50%] bg-transparentGreen mt-[35px] h-[365px] max-w-max m-auto mb-[16px]"
		>
			<img
				src="public/image/start-screen-image.webp"
				alt=""
			>
		</div>
		<div class="flex justify-between relative">
			<div
				class="flex gap-[4px] justify-center items-center shadow-custom rounded-[16px] max-w-max py-[6px] px-[12px]"
			>
				{{ energyCurrency }}
				<IconEnergy />
			</div>
			<div :class="{ 'opacity-0': loading }">
				<div
					v-if="!tonConnectActive"
					class="flex items-center gap-[8px] bg-forestGreen rounded-[16px] max-w-max py-[10px] px-[24px] cursor-pointer h-[44px]"
				>
					<div class="text-white">
						Подключить TON кошелёк
					</div>
					<IconArrowRight />
				</div>
				<div
					v-else
					class="flex items-center justify-center w-[48px] bg-neonBlue rounded-[16px] relative cursor-pointer h-[44px]"
				>
					<IconDiamond />
				</div>
				<div
					id="ton-connect-button-root"
					class="absolute opacity-0 right-0 top-0"
				/>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed, nextTick } from 'vue'
import { IconGold, IconEnquiry, IconEnergy, IconArrowRight, IconClose, IconDiamond } from 'shared/components/Icon'
import { VModal } from 'shared/components/Modal'
import { VButton } from 'shared/components/Button'
import { ButtonColors } from 'shared/components/Button'
import WebApp from '@twa-dev/sdk'
import { useTWA } from 'entities/Session/api/useTWA'
import { useAuthButton } from 'entities/Session/api/useAuthButton'
import { getTonConnectUIInstance } from 'entities/Session/api/tonConnectUIInstance'
import { Locales, useLocaleStore } from 'shared/lib/i18n'

const props = withDefaults(defineProps<{ currency: number, energyCurrency: number }>(), {
	currency: 0,
	energyCurrency: 100
})

const show = ref(false)
const tonConnectActive = ref(false)
const loading = ref(true)
const localeStore = useLocaleStore()

const openModal = () => {
	show.value = true
}

const closeModal = () => {
	show.value = false
}

onMounted(async () => {
	const connect = getTonConnectUIInstance()
	tonConnectActive.value = await connect.connectionRestored
	await nextTick()
	useAuthButton()
	useTWA()
	const user = WebApp.initDataUnsafe.user
	if (user && user.language_code) {
		localeStore.setLocale(user.language_code as Locales)
	}
	loading.value = false
})

const formattedCurrency = computed(() => {
	return props.currency.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
})
</script>

<style scoped>
.loading-overlay {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: rgba(255, 255, 255, 0.8);
	display: flex;
	align-items: center;
	justify-content: center;
	z-index: 9999;
}

.loader {
	border: 16px solid #f3f3f3;
	border-top: 16px solid #3498db;
	border-radius: 50%;
	width: 120px;
	height: 120px;
	animation: spin 2s linear infinite;
}

@keyframes spin {
	0% {
		transform: rotate(0deg);
	}

	100% {
		transform: rotate(360deg);
	}
}
</style>