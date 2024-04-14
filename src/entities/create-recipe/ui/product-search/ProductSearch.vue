<template>
	<input
		class="p-[15px] bg-white h-11 w-[237px] rounded-[40px] placeholder:text-[#735F2B] placeholder:opacity-60"
		:placeholder="t('search')"
		type="text"
	>
</template>

<script setup lang="ts">
import Localization from './ProductSearch.localization.json'
import { useTranslation } from '@/shared/lib/i18n'

const { t } = useTranslation(Localization)
</script>

<style scoped>

</style>