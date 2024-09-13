<template>
	<component :is="layout">
		<div
			v-if="isLoading"
			class="loading"
		>
			<div class="loading__spinner">
				Loading...
			</div>
		</div>
		<router-view />
	</component>
</template>

<script setup lang="ts">
import { shallowRef, watch, type Component } from 'vue'
import { useRoute } from 'vue-router'
import { DefaultLayout } from './layouts'
import { useLocaleStore } from '@/shared/lib/i18n'
import { useAuthorization } from '@/features/Auth/log-in'
import { useSessionStore } from '@/entities/Session'

const route = useRoute()

const layout = shallowRef<Component>(DefaultLayout)

const { isLoading, authorize } = useAuthorization()
const sessionStore = useSessionStore()
const localeStore = useLocaleStore()
localeStore.initializeLocale('ru')
watch(() => route?.meta?.layout, (newLayoutComponent) => {
	layout.value = newLayoutComponent || DefaultLayout
  if (!sessionStore.isAuthenticated) {
    authorize()
  }
})

</script>

<style lang="scss" src="shared/styles/index.scss" />
