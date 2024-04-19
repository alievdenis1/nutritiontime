<template>
	<input
		:ref="modelValue"
		class="p-[15px] bg-white h-11 w-[237px] rounded-[40px] placeholder:text-[#735F2B] placeholder:opacity-60"
		:placeholder="t('search')"
		type="text"
		@focus="onToggleModal"
	>
	<CookingMethodModal
		v-if="modelValue"
		v-model="isModalOpen"
	/>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import CookingMethodModal from './CookingMethodModal.vue'

import Localization from './ProductSearch.localization.json'
import { useTranslation } from '@/shared/lib/i18n'

const { t } = useTranslation(Localization)

defineProps<{
	modelValue?: undefined
}>()

const isModalOpen = ref(false)
const emit = defineEmits(['update:modelValue'])

const onToggleModal = () => {
	emit('update:modelValue', true)
	isModalOpen.value = true
}

</script>

<style scoped>

</style>