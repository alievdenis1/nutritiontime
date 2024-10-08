<template>
	<component :is="layout">
		<div
			v-if="isLoading"
			class="loading"
		>
			<div class="loading__spinner">
				<v-loading />
			</div>
		</div>
		<div v-else>
			<router-view />
		</div>
	</component>
</template>

<script setup lang="ts">
import { shallowRef, watch, type Component } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { DefaultLayout } from './layouts'
import { twa } from '@/shared/lib/api/twa'
import { useLocaleStore } from '@/shared/lib/i18n'
import { useAuthorization } from '@/features/Auth/log-in'
import { useSessionStore } from '@/entities/Session'

const route = useRoute()
const router = useRouter()

const layout = shallowRef<Component>(DefaultLayout)

const { isLoading, authorize } = useAuthorization()
const sessionStore = useSessionStore()
const localeStore = useLocaleStore()

const authUser = async () => {
  if (!sessionStore.isAuthenticated) {
    await authorize()
    localeStore.initializeLocale(sessionStore.lang)
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

// TODO
//   const startParams = twa.initDataUnsafe.start_param
}

authUser()

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
