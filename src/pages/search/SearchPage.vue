<template>
	<div id="search">
		<search-widget v-show="isLoading" />
		<VSkeletonCard v-show="!isLoading" />
	</div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { SearchWidget } from 'widgets/search'
import { VSkeletonCard } from 'shared/components/ui/skeleton'
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

<style scoped>

</style>