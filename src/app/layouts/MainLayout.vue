<template>
	<header-widget />
	<main
		v-show="isLoading"
		id="main"
		class="layout layout--main pb-[100px] bg-mainBg"
	>
		<slot />
	</main>
	<!--	<footer-widget-->
	<!--		v-show="isLoading"-->
	<!--		class="sticky bottom-[20px]"-->
	<!--	/>-->
	<VSkeletonLocalization
		v-show="!isLoading"
		class="p-[16px] bg-mainBg skeletonContainer"
	/>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
// import { FooterWidget } from 'widgets/footer'
import { HeaderWidget } from 'widgets/header'
import { VSkeletonLocalization } from 'shared/components/ui/skeleton'
import { useLocaleStore } from '@/shared/lib/i18n'
import { storeToRefs } from 'pinia'

const localeStore = useLocaleStore()
const { currentLocale } = storeToRefs(localeStore)

const isLoading = ref(true)

const startLoading = () => {
	isLoading.value = false
	setTimeout(() => {
		isLoading.value = true
	}, 1000)
}

watch(currentLocale, () => {
	startLoading()
})

startLoading()
</script>

<style lang="scss" scoped>
	.skeletonContainer {
		min-height: calc(100vh - 64px);
	}
</style>