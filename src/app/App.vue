<template>
	<TonConnectUIProvider :options="options">
		<ElConfigProvider :locale="elementPlusLocale">
			<VConfirm />

			<component :is="layout">
				<div
					v-if="isLoading"
					class="loading"
				>
					<div class="loading__spinner">
						<VLoading />
					</div>
				</div>
				<router-view v-else />
			</component>
		</ElConfigProvider>
	</TonConnectUIProvider>
</template>

<script setup lang="ts">
import { shallowRef, watch, computed, type Component, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { DefaultLayout } from './layouts'
import { twa } from '@/shared/lib/api/twa'
import { useLocaleStore } from '@/shared/lib/i18n'
import { useAuthorization } from '@/features/Auth/log-in'
import { useSessionStore } from '@/entities/Session'
import { VConfirm } from '@/shared/components/Confirm'
import { TonConnectUIProvider } from '@townsquarelabs/ui-vue'
import WebApp from '@twa-dev/sdk'
import { ElConfigProvider } from 'element-plus'
import ru from 'element-plus/es/locale/lang/ru'
import en from 'element-plus/es/locale/lang/en'
import { VLoading } from 'shared/components/Loading'

const route = useRoute()
const router = useRouter()

const layout = shallowRef<Component>(DefaultLayout)

const { isLoading, authorize } = useAuthorization()
const sessionStore = useSessionStore()
const localeStore = useLocaleStore()

const elementPlusLocale = computed(() => {
	const langs = {
		ru,
		en,
	}

	return langs[localeStore.currentLocale] || ru
})

const authUser = async () => {
	if (!sessionStore.isAuthenticated) {
		await authorize()
		localeStore.initializeLocale(sessionStore.lang)
	}
}

const options = {
	manifestUrl: 'https://alievdenis1.github.io/nutritiontime/tonconnect-manifest.json',
	language: sessionStore.lang
}

const handleStartParamRedirect = () => {
	const startParam = WebApp.initDataUnsafe.start_param

	if (!startParam) return

	// Обработка параметра payment
	if (startParam.startsWith('payment_')) {
		const months = startParam.replace('payment_', '')
		if (['1', '3', '12'].includes(months)) {
			router.push({
				name: 'payment',
				query: { months }
			})
		}
		return
	}

	// Обработка параметра statistics
	if (startParam === 'statistics') {
		router.push({
			name: 'main',
			query: { tab: 'statistics' }
		})
	}
}

if (twa) {
	twa.ready()
	twa.enableClosingConfirmation()
	twa.disableVerticalSwipes()
	twa.expand()
	twa.onEvent('viewportChanged', ({ isStateStable }) => {
		if (isStateStable) {
			twa && twa.expand()
		}
	})
}

authUser()

onMounted(() => {
	console.log('hahahahahah')

	authUser().then(() => {
		handleStartParamRedirect()
	})
})

watch(() => route?.path, () => {
	authUser()
})

watch(() => route?.meta?.layout, (newLayoutComponent) => {
	layout.value = newLayoutComponent || DefaultLayout
})

watch(() => route?.path, () => {
	const hasBackButton = route?.meta?.backButton

	if (twa && hasBackButton) {
		const BackButton = twa.BackButton
		BackButton.show()

		BackButton.onClick(() => {
			router.go(-1)
			BackButton.hide()
		})
	}
})
</script>

<style lang="scss" src="shared/styles/index.scss" />
