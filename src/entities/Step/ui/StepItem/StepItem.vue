<template>
	<!-- TODO: проверить стили и отступы -->
	<div class="space-y-3">
		<h3 class="text-lg font-semibold text-darkGray">
			{{ t('step', { order: props.order }) }}
		</h3>
		<p class="text-sm text-slateGray mt-[12]">
			{{ props.description }}
		</p>
		<img
			:src="props.image"
			:alt=" t('recipe.stepImage')"
			class="w-full h-[250px] object-cover rounded-[12px]"
		>
	</div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'
import Localization from './Step.localization.json'
import { useTranslation } from 'shared/lib/i18n'

const { t } = useTranslation(Localization)

const props = defineProps<{
    description: string;
    image: string;
    order: number;
}>()

</script>

<style scoped>
</style>

