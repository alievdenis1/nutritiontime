<template>
	<div
		ref="currencyContainer"
		class="text-xxxl max-w-[160px]"
	>
		<span ref="currencyElement">{{ formattedCurrency }}</span>
	</div>
</template>
<script setup lang="ts">
import { ref, computed, watchEffect, watch, onUnmounted } from 'vue'

import { autoTextSize } from '@/shared/lib/auto-text-size'

type DisconnectableFunction = {
	(): void;
	disconnect: () => void;
};
const updateTextSize = ref<DisconnectableFunction | null>(null)

const currencyContainer = ref<HTMLElement | null>(null)
const currencyElement = ref<HTMLElement | null>(null)

const props = defineProps<{ currency: string; }>()

const formattedCurrency = computed(() => {
	const value = props.currency ?? 0
	return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
})

watch(formattedCurrency, () => {
	updateTextSize.value && updateTextSize.value()
})

onUnmounted(() => {
	updateTextSize.value && updateTextSize.value.disconnect()
})

watchEffect(() => {
	if (currencyContainer.value && currencyElement.value) {
		updateTextSize.value = autoTextSize({
			containerEl: currencyContainer.value,
			innerEl: currencyElement.value,
		})
	}
})
</script>

<style scoped>
</style>